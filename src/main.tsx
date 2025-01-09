import ReactDOM from "react-dom/client";
import App from "./App";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
