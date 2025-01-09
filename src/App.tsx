import { useState } from "react";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import SorryIJustWentIntoATunn from "./pages/SorryIJustWentIntoATun";
import EnterAPIKey from "./components/EnterAPIKey/EnterAPIKey";

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

const App = () => {
  const [apiKey, setApiKey] = useState(API_KEY);
  const [userStarted, setUserStarted] = useState(false);

  if (!apiKey || !userStarted) {
    return (
      <EnterAPIKey
        apiKey={apiKey}
        setApiKey={setApiKey}
        onSubmit={() => setUserStarted(true)}
      />
    );
  }

  return (
    <LiveAPIProvider url={uri} apiKey={apiKey}>
      <SorryIJustWentIntoATunn />
    </LiveAPIProvider>
  );
};
export default App;
