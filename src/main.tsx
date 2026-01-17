import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import LoginAdmin from "./pages/LoginAdmin/index.tsx";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Route, Routes } from "react-router";
import FormAssistenteSocial from "./pages/AssistenteSocial/index.tsx";
import ListAssistentes from "./pages/AssistenteSocial/listAssistentes.tsx";
import VisitasPage from "./pages/Visitas/index.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginAdmin />} />
        <Route path="/assistente" element={<FormAssistenteSocial />} />
        <Route path="/assistente/view" element={<ListAssistentes />} />
        <Route path="/visitas" element={<VisitasPage />} />
      </Routes>
    </StrictMode>
  </BrowserRouter>
);