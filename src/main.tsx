import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css";
import App from "./App.tsx";
import "leaflet/dist/leaflet.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerSW } from "virtual:pwa-register";

export const queryClient = new QueryClient({});

registerSW({
  onOfflineReady() {
    console.log("App pronto para uso offline");
  },
  onNeedRefresh() {
    console.log("Nova versão disponível");
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
    </Provider>
  </QueryClientProvider>
);