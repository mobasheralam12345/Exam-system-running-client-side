import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./Route"; // Import the router from Routes.js
import html2canvas from "html2canvas-pro";
window.html2canvas = html2canvas; // html2pdf will use this renderer [web:34][web:57]

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
