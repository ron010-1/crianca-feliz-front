import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TabelaBeneficiarios from "./TabelaBeneficiarios";


vi.mock('react-leaflet', () => ({
  MapContainer: () => <div>Mapa Mock</div>,
  TileLayer: () => <div>Layer Mock</div>,
  Marker: () => <div>Marker Mock</div>,
}));

vi.mock('../loading/Loading', () => ({
  default: () => <div data-testid="mock-loading">Carregando...</div>
}));

vi.mock('../empty/Empty', () => ({
  default: () => <div data-testid="mock-empty">Vazio</div>
}));

const dadosMock = [{
  id: 1,
  name: "Ana Clara",
  responsavel: "João",
  dataNascimento: "12/07/2010",
  location: [-7.11, -34.84],
  telefone1: "99999999"
}];

describe("Componente TabelaBeneficiarios", () => {
  
  it("deve renderizar o componente Loading quando a prop loading for true", () => {
    render(<TabelaBeneficiarios beneficiarios={[]} loading={true} />);
    
    expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
    expect(screen.queryByText("Ana Clara")).not.toBeInTheDocument();
  });

  it("deve renderizar o componente Empty quando a lista de beneficiários for vazia", () => {
    render(<TabelaBeneficiarios beneficiarios={[]} loading={false} />);
    
    expect(screen.getByTestId("mock-empty")).toBeInTheDocument();
  });

  it("deve renderizar a tabela e os dados quando houver beneficiários", () => {
    const mockPagination = {
        pagination: { page: 1, limit: 5, totalItens: 10 },
        handlePageBeneficiarios: vi.fn()
    };

    render(
        <TabelaBeneficiarios 
            beneficiarios={dadosMock} 
            loading={false}
            paginationDetails={mockPagination}
        />
    );

    expect(screen.getByText("Ana Clara")).toBeInTheDocument();
    
    expect(screen.getByTitle("Acessar localização")).toBeInTheDocument();
  });
});