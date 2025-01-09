import styles from "./EnterAPIKey.module.scss";
import { ChangeEvent, useMemo } from "react";

const EnterAPIKey = ({
  apiKey,
  setApiKey,
  onSubmit,
}: {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  onSubmit: () => void;
}) => {
  const isValid = useMemo(() => /^(\w{39,39})$/.test(apiKey || ""), [apiKey]);

  return (
    <div className={styles.root}>
      <h1>Sorry, I went into a tunn...</h1>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <span>
          Enter your <strong>Gemini API</strong> Key
        </span>
        <input
          type="text"
          value={apiKey || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setApiKey(e.target.value)
          }
        />
        <input type="submit" disabled={!isValid} />
        <div>
          Don’t have a Gemini API key?{" "}
          <a href="https://aistudio.google.com/apikey" target="_blank">
            Create one here
          </a>
        </div>
      </form>
      <span>
        An A.I. <em>experience</em> by{" "}
        <a href="https://isjackwild.com/" target="_blank">
          Jack Wild
        </a>
      </span>
    </div>
  );
};

export default EnterAPIKey;
