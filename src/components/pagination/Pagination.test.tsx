import { render, screen } from "@testing-library/react";
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
});