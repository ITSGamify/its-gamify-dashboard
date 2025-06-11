// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n/config";
import App from "./App";
import { GlobalProvider } from "@providers/GlobalProvider";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <GlobalProvider>
    <App />
  </GlobalProvider>
  // </StrictMode>
);
