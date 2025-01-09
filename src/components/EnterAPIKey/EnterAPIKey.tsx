import SorryIJustWentIntoATunnPhoneIntro from "../SorryIJustWentIntoATunnPhone/SorryIJustWentIntoATunnPhoneIntro";
import styles from "./EnterAPIKey.module.scss";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import backgroundVideo from "../../assets/Tour of the Eurostar Departure Lounge St Pancras International [pCkmEgsdBDU].mp4";
import audioVideo from "../../assets/[Sound] Eurostar Boarding Announcements at London St. Pancras (28.10.2019) ｜ ユーロスター乗車案内放送 [ESoW0ngJ9rY].mp4";

const EnterAPIKey = ({
  apiKey,
  setApiKey,
  onSubmit,
}: {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  onSubmit: () => void;
}) => {
  const [addAudio, setAddAudio] = useState(false);
  const isValid = useMemo(() => /^(\w{39,39})$/.test(apiKey || ""), [apiKey]);

  useEffect(() => {
    if (isValid) {
      onSubmit();
    }
  }, [isValid]);

  useEffect(() => {
    const onInteract = () => {
      setAddAudio(true);
    };

    (async () => {
      try {
        const a = new Audio();
        a.src =
          "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
        await a.play();
        setAddAudio(true);
      } catch (e) {
        window.addEventListener("pointerdown", onInteract, { once: true });
        window.addEventListener("keydown", onInteract, { once: true });
      }
    })();

    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, []);

  return (
    <div className={styles.root}>
      {addAudio ? (
        <video
          style={{ opacity: 0 }}
          className={styles.audio}
          src={audioVideo}
          playsInline
          // muted
          autoPlay
          onPlay={(e) => (e.target.volume = 0.2)}
        />
      ) : null}
      <video
        className={styles.background}
        src={backgroundVideo}
        playsInline
        muted
        autoPlay
        loop
      />
      <SorryIJustWentIntoATunnPhoneIntro
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </div>
  );
};

export default EnterAPIKey;
