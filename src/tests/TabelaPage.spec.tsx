import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App"; 

vi.mock('react-leaflet', () => ({
    MapContainer: () => <div>Mapa</div>,
    TileLayer: () => <div>Layer</div>,
    Marker: () => <div>Marker</div>,
}));

describe("Tela de Listagem de Beneficiários", () => {
    
    
    it("deve navegar entre páginas e mostrar loading", async () => {
        render(<App />);
        fireEvent.click(screen.getByText("Próxima"));
        await screen.findByText(/carregando/i);
        await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument(), { timeout: 4000 });
    });
 
});