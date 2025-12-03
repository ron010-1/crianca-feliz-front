import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock do Leaflet para o App não quebrar ao renderizar o mapa
vi.mock('react-leaflet', () => ({
    MapContainer: () => <div>Mapa</div>,
    TileLayer: () => <div>Layer</div>,
    Marker: () => <div>Marker</div>,
}));

describe("Integração App - Fluxo de Loading", () => {
  it("deve mostrar o loading ao mudar de página e sumir após o tempo", async () => {
    render(<App />);

    // 1. Busca o botão de próxima página e clica
    const btnProxima = screen.getByText("Próxima");
    fireEvent.click(btnProxima);

    // 2. Verifica se o texto de carregamento apareceu
    // Usamos findByText que já espera aparecer automaticamente
    await screen.findByText(/carregando/i);

    // 3. Verifica se o loading SUMIU depois de 2 segundos
    // O waitFor vai ficar tentando até atingir o timeout de 4000ms (4s)
    await waitFor(() => {
        expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
    }, { timeout: 4000 }); 
  });
});