import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import App from "../App"; 

vi.mock('react-leaflet', () => ({
    MapContainer: () => <div>Mapa</div>,
    TileLayer: () => <div>Layer</div>,
    Marker: () => <div>Marker</div>,
}));

describe("Tela de Listagem de Beneficiários", () => {
    test("deve navegar entre páginas e mostrar loading", async () => {
        render(<App />);
        
        const btnProxima = screen.getByRole("button", { name: "Próxima" });
        await userEvent.click(btnProxima);
        
        await screen.findByText(/carregando/i);
        
        await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument(), { timeout: 4000 });
    });
});