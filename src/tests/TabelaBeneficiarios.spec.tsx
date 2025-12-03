import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import TabelaBeneficiarios from "../components/tabela-beneficiarios/TabelaBeneficiarios";

vi.mock('react-leaflet', () => ({
  MapContainer: () => <div>Mapa Mock</div>,
  TileLayer: () => <div>Layer Mock</div>,
  Marker: () => <div>Marker Mock</div>,
}));

vi.mock('../components/loading/Loading', () => ({
  default: () => <div data-testid="mock-loading">Carregando...</div>
}));

vi.mock('../components/empty/Empty', () => ({
  default: () => <div data-testid="mock-empty">Vazio</div>
}));

const dadosMock = [{
  id: 1,
  name: "Ana Clara",
  responsavel: "João",
  dataNascimento: "12/07/2010",
  location: [-7.11, -34.84],
  telefone1: "(83) 99999-8888",
  telefone2: "(83) 3333-3333"
}];

describe("Componente TabelaBeneficiarios", () => {
  
  test("deve renderizar o componente Loading quando a prop loading for true", () => {
    render(<TabelaBeneficiarios beneficiarios={[]} loading={true} />);
    
    expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
    expect(screen.queryByText("Ana Clara")).not.toBeInTheDocument();
  });

  test("deve renderizar o componente Empty quando a lista de beneficiários for vazia", () => {
    render(<TabelaBeneficiarios beneficiarios={[]} loading={false} />);
    
    expect(screen.getByTestId("mock-empty")).toBeInTheDocument();
  });

  test("deve renderizar a tabela e os dados quando houver beneficiários", () => {
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

  test("deve renderizar colunas de dados específicos como telefone corretamente", () => {
    render(
        <TabelaBeneficiarios 
            beneficiarios={dadosMock} 
            loading={false}
        />
    );

    expect(screen.getByText("(83) 99999-8888")).toBeInTheDocument();
    expect(screen.getByText("(83) 3333-3333")).toBeInTheDocument();
  });

  test("deve renderizar a seção de paginação se os detalhes forem fornecidos e houver dados", () => {
    const mockPagination = {
        pagination: { page: 1, limit: 5, totalItens: 20 },
        handlePageBeneficiarios: vi.fn()
    };

    render(
        <TabelaBeneficiarios 
            beneficiarios={dadosMock} 
            loading={false}
            paginationDetails={mockPagination}
        />
    );

    expect(screen.getByRole("button", { name: "Próxima" })).toBeInTheDocument();
    expect(screen.getByText("de 4")).toBeInTheDocument();
  });
});