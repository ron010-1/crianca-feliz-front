import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Pagination from "./Pagination";

describe("Componente Pagination", () => {
  const mockHandleItens = vi.fn();

  it("deve mostrar a paginação quando houver mais itens que o limite (ex: 6 itens, limite 5)", () => {
    render(
      <Pagination 
        pagination={{ 
            page: 1, 
            limit: 5,
            totalItens: 6
        }} 
        handleItens={mockHandleItens} 
      />
    );

    const btnProxima = screen.getByText("Próxima");
    expect(btnProxima).toBeInTheDocument();
    expect(btnProxima).not.toBeDisabled();
  });

  it("não deve mostrar a paginação se tiver exatamente 5 itens (limite)", () => {
    render(
      <Pagination 
        pagination={{ 
            page: 1, 
            limit: 5, 
            totalItens: 5
        }} 
        handleItens={mockHandleItens} 
      />
    );

    const btnProxima = screen.queryByText("Próxima");
    expect(btnProxima).not.toBeInTheDocument();
  });

  it("deve calcular e exibir o número correto de páginas totais", () => {
    render(
      <Pagination 
        pagination={{ page: 1, limit: 10, totalItens: 25 }} 
        handleItens={mockHandleItens} 
      />
    );

    expect(screen.getByText("de 3")).toBeInTheDocument();
  });

  it("deve desabilitar o botão Próxima quando estiver na última página", () => {
    render(
      <Pagination 
        pagination={{ page: 3, limit: 10, totalItens: 25 }} 
        handleItens={mockHandleItens} 
      />
    );

    const btnProxima = screen.getByText("Próxima");
    expect(btnProxima).toBeDisabled();
  });

  it("deve chamar a função handleItens com a página anterior ao clicar em Anterior", () => {
    render(
      <Pagination 
        pagination={{ page: 2, limit: 10, totalItens: 25 }} 
        handleItens={mockHandleItens} 
      />
    );

    const btnAnterior = screen.getByText("Anterior");
    fireEvent.click(btnAnterior);

    expect(mockHandleItens).toHaveBeenCalledWith(1);
  });
});