import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { create, all } from 'mathjs';

export const math = create(all);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);