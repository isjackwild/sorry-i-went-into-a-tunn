/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  MutableRefObject,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MultimodalLiveAPIClientConnection,
  MultimodalLiveClient,
} from "../lib/multimodal-live-client";
import { AudioStreamer } from "../lib/audio-streamer";
import { audioContext } from "../lib/utils";
import VolMeterWorket from "../lib/worklets/vol-meter";
import { AudioRecorder } from "../lib/audio-recorder";

export type UseLiveAPIResults = {
  client: MultimodalLiveClient;
  connected: boolean;
  connect: (config: any) => Promise<void>;
  disconnect: () => Promise<void>;
  volume: number;
  audioStreamer?: MutableRefObject<AudioStreamer | null> | null;
  audioRecorder?: MutableRefObject<AudioRecorder | null> | null;
};

export function useLiveAPI({
  url,
  apiKey,
}: MultimodalLiveAPIClientConnection): UseLiveAPIResults {
  const client = useMemo(
    () => new MultimodalLiveClient({ url, apiKey }),
    [url, apiKey]
  );
  const audioStreamerRef = useRef<AudioStreamer | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(new AudioRecorder());
  const [connected, setConnected] = useState(false);
  const [volume, setVolume] = useState(0);
  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: "audio/pcm;rate=16000",
          data: base64,
        },
      ]);
    };
    if (connected && !!audioRecorderRef.current) {
      audioRecorderRef.current.on("data", onData).start();
    } else {
      audioRecorderRef.current?.stop();
    }
    return () => {
      audioRecorderRef.current?.off("data", onData);
    };
  }, [connected, client, audioRecorderRef]);

  // register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current) {
      console.log("Try Create Audio Streamer!");
      audioContext({ id: "audio-out" }).then((audioCtx: AudioContext) => {
        console.log("Got CTX");
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        console.log("Created Audio Streamer!");
        audioStreamerRef.current
          .addWorklet<any>("vumeter-out", VolMeterWorket, (ev: any) => {
            setVolume(ev.data.volume);
          })
          .then(() => {
            // Successfully added worklet
          });
      });
    }
  }, [audioStreamerRef]);

  useEffect(() => {
    const onClose = () => {
      setConnected(false);
    };

    const stopAudioStreamer = () => audioStreamerRef.current?.stop();

    const onAudio = (data: ArrayBuffer) =>
      audioStreamerRef.current?.addPCM16(new Uint8Array(data));

    client
      .on("close", onClose)
      .on("interrupted", stopAudioStreamer)
      .on("audio", onAudio);

    return () => {
      client
        .off("close", onClose)
        .off("interrupted", stopAudioStreamer)
        .off("audio", onAudio);
    };
  }, [client]);

  const connect = useCallback(
    async (config: any) => {
      if (!config) {
        throw new Error("config has not been set");
      }
      client.disconnect();
      await client.connect(config);
      setConnected(true);
    },
    [client, setConnected]
  );

  const disconnect = useCallback(async () => {
    client.disconnect();
    setConnected(false);
  }, [setConnected, client]);

  return {
    client,
    connected,
    connect,
    disconnect,
    volume,
    audioStreamer: audioStreamerRef,
    audioRecorder: audioRecorderRef,
  };
}
