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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      Enter your Gemini API Key
      <input
        type="text"
        value={apiKey || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setApiKey(e.target.value)
        }
      />
      <input type="submit" disabled={!isValid} />
      <p>
        Don’t have a Gemini API key?{" "}
        <a href="https://aistudio.google.com/apikey" target="_blank">
          Create one here
        </a>
      </p>
    </form>
  );
};

export default EnterAPIKey;
