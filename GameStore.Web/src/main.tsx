import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Apply saved theme early to avoid a flash
try {
  const raw = localStorage.getItem("gamestore.theme");
  const theme = raw ? (JSON.parse(raw) as unknown) : null;
  if (theme === "light" || theme === "dark") {
    document.documentElement.dataset.theme = theme;
  }
} catch {
  // ignore
}

if (!document.documentElement.dataset.theme) {
  document.documentElement.dataset.theme = "light";
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
