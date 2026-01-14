import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import LoginAdmin from "./pages/LoginAdmin/index.tsx";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Route, Routes } from "react-router";
import FormAssistenteSocial from "./pages/AssistenteSocial/index.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
  <StrictMode>
    <Routes>
      <Route path="/" element={<App />}/>
      <Route path="/login" element={<LoginAdmin/>}/>
      <Route path="/assistente" element={<FormAssistenteSocial/>}/>
    </Routes>
  </StrictMode>
  </BrowserRouter>
);
