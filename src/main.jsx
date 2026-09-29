import React from "react";
import { createRoot } from "react-dom/client";
import App from "./Portfolio";
import "./portfolio.css";
import "./contact-layout.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
