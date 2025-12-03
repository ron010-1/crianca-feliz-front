import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import Pagination from "../components/pagination/Pagination";

describe("Componente Pagination", () => {
  const mockHandleItens = vi.fn();

  test("deve mostrar a paginação quando houver mais itens que o limite", () => {
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

    const btnProxima = screen.getByRole("button", { name: "Próxima" });
    expect(btnProxima).toBeInTheDocument();
    expect(btnProxima).not.toBeDisabled();
  });

  test("não deve mostrar a paginação se tiver itens iguais ao limite", () => {
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

    const btnProxima = screen.queryByRole("button", { name: "Próxima" });
    expect(btnProxima).not.toBeInTheDocument();
  });

  test("deve calcular e exibir o número correto de páginas totais", () => {
    render(
      <Pagination 
        pagination={{ page: 1, limit: 10, totalItens: 25 }} 
        handleItens={mockHandleItens} 
      />
    );

    expect(screen.getByText("de 3")).toBeInTheDocument();
  });

  test("deve desabilitar o botão Próxima quando estiver na última página", () => {
    render(
      <Pagination 
        pagination={{ page: 3, limit: 10, totalItens: 25 }} 
        handleItens={mockHandleItens} 
      />
    );

    const btnProxima = screen.getByRole("button", { name: "Próxima" });
    expect(btnProxima).toBeDisabled();
  });

  test("deve chamar a função handleItens com a página anterior ao clicar em Anterior", async () => {
    render(
      <Pagination 
        pagination={{ page: 2, limit: 10, totalItens: 25 }} 
        handleItens={mockHandleItens} 
      />
    );

    const btnAnterior = screen.getByRole("button", { name: "Anterior" });
    await userEvent.click(btnAnterior);

    expect(mockHandleItens).toHaveBeenCalledWith(1);
  });
});