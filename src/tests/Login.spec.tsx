import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginAdmin from "../pages/LoginAdmin";

describe("LoginAdmin form", () => {

  test("não deve permitir email inválido",  () => {
    render(<LoginAdmin />);

    const inputEmail = screen.getByPlaceholderText("Email");
    const inputPassword = screen.getByPlaceholderText("Senha");

     userEvent.type(inputEmail, "emailinvalido.com"); 
     userEvent.type(inputPassword, "SenhaValidaA");

    const button = screen.getByRole("button", { name: "Entrar" });
     userEvent.click(button);

    expect(screen.getByText("Digite um email válido.")).toBeInTheDocument();
  });

  test("não deve permitir senha inválida",  () => {
    render(<LoginAdmin />);

    const inputEmail = screen.getByPlaceholderText("Email");
    const inputPassword = screen.getByPlaceholderText("Senha");

    userEvent.type(inputEmail, "emailvalido@gmail.com");
    userEvent.type(inputPassword, "senhainvalida");

    const button = screen.getByRole("button", { name: "Entrar" });
    userEvent.click(button);

    expect(
      screen.getByText("A senha deve conter ao menos 1 letra maiúscula.")
    ).toBeInTheDocument();
  });

  test("deve chamar alert quando email e senha são válidos",  () => {
    window.alert = vi.fn();

    render(<LoginAdmin />);

    const inputEmail = screen.getByPlaceholderText("Email");
    const inputPassword = screen.getByPlaceholderText("Senha");
    const button = screen.getByRole("button", { name: "Entrar" });

    userEvent.type(inputEmail, "usuario@gmail.com");
    userEvent.type(inputPassword, "SenhaValidaA");
    userEvent.click(button);

    expect(window.alert).toHaveBeenCalledWith(
      "Login válido — execute aqui a lógica de login"
    );
  });
});
