import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginAdmin from "../pages/LoginAdmin";

describe("LoginAdmin form", () => {
  test("deve mostrar mensagem de campo obrigatório quando campo é tocado e vazio", async () => {
    render(<LoginAdmin />);
    
    const inputEmail = screen.getByPlaceholderText("Email");
    
    await userEvent.click(inputEmail);
    await userEvent.tab();
    
    expect(
      screen.getByText("O email é obrigatório.")
    ).toBeInTheDocument();
  });

  test("deve limpar os campos após submit válido", async () => {
    window.alert = vi.fn();
    
    render(<LoginAdmin />);
    
    const inputEmail = screen.getByPlaceholderText("Email");
    const inputPassword = screen.getByPlaceholderText("Senha");
    const button = screen.getByRole("button", { name: "Entrar" });
    
    await userEvent.type(inputEmail, "usuario@gmail.com");
    await userEvent.type(inputPassword, "SenhaValidaA");
    await userEvent.click(button);

    expect(inputEmail).toHaveValue("");
    expect(inputPassword).toHaveValue("");
  });

  test("o botão deve estar desabilitado inicialmente", () => {
    render(<LoginAdmin />);
    
    const button = screen.getByRole("button", { name: "Entrar" });
    
    expect(button).toBeDisabled();
    
    expect(button).toHaveAttribute("disabled");
    
    expect(button).toHaveClass("button", "primary"); 
  });
});
