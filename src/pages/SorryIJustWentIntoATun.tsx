import styles from "./SorryIJustWentIntoATunn.module.scss";
import { useEffect, useState } from "react";
import { useLiveAPIContext } from "../contexts/LiveAPIContext";
import SorryIJustWentIntoATunnPhone from "../components/SorryIJustWentIntoATunnPhone/SorryIJustWentIntoATunnPhone";
import { SYSTEM_INSTRUCTIONS } from "../CONSTANTS";
import backgroundVideo from "../assets/French English announcements greeting passengers on board TGV Eurostar train at Paris Gare du Nord [iso5vTiUmHE].mp4";

const SorryIJustWentIntoATunn = () => {
  const { client, connected, connect, volume, audioStreamer, audioRecorder } =
    useLiveAPIContext();
  const [inVolume, setInVolume] = useState(0);
  const [signal, setSignal] = useState(1);

  useEffect(() => {
    onStart();
  }, []);

  const onStart = async () => {
    await connect({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
        },
      },
      systemInstruction: {
        parts: [
          {
            text: SYSTEM_INSTRUCTIONS,
          },
        ],
      },
      tools: [
        { googleSearch: {} },
        {
          functionDeclarations: [],
        },
      ],
    });
    audioRecorder?.on("volume", setInVolume);

    client.send([
      {
        text: "Hi, I'm just on the train to Paris for the board meeting. I noticed a few issues with the report you sent over email",
      },
    ]);
  };

  // const onStop = () => {
  //   audioRecorder?.off("volume", setInVolume);
  //   disconnect();
  // };

  useEffect(() => {
    if (volume < 0.1 && inVolume < 0.1 && connected) {
      const interval = setInterval(() => {
        console.log("on no speak");
        client.send([
          {
            text: "[Your boss has not spoken for a while. Try and start the conversation about the issues in the report]",
          },
        ]);
      }, 6666);

      return () => {
        clearInterval(interval);
      };
    }
  }, [volume < 0.1 && inVolume < 0.1 && connected]);

  useEffect(() => {
    let timeout = -1;
    const updateSignal = () => {
      let newSignal =
        Math.cos(Date.now() * 0.001) * 0.25 + 0.25 + Math.random() * 0.75;
      newSignal = Math.round(newSignal / 0.2) * 0.2;
      setSignal(newSignal);

      if (audioStreamer) {
        const streamerSignalParam =
          audioStreamer?.poorSignalWorklet?.parameters.get("signal");
        streamerSignalParam!.value = newSignal;
      }

      if (audioRecorder) {
        const recorderSignalParam =
          audioRecorder?.poorSignalWorklet?.parameters.get("signal");
        if (recorderSignalParam) {
          recorderSignalParam.value = Math.min(1, newSignal * 1.5);
        }
      }
      timeout = setTimeout(updateSignal, 1000 + Math.random() * 2000);
    };

    timeout = setTimeout(updateSignal, 100 + Math.random() * 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [connected]);

  // useEffect(() => {}, []);

  return (
    <div className={styles.layout}>
      {/* <button onClick={connected ? onStop : onStart}>
        {connected ? "Stop" : "Start"} Streaming
      </button> */}
      <video
        className={styles.background}
        src={backgroundVideo}
        playsInline
        // muted
        autoPlay
        onPlay={(e) => (e.target.volume = 0.2)}
      />
      <main>
        <SorryIJustWentIntoATunnPhone signal={signal} />
      </main>
    </div>
  );
};

export default SorryIJustWentIntoATunn;
