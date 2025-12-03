import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginAdmin from "../pages/LoginAdmin";

describe("LoginAdmin form", () => {

  test("não deve permitir email inválido", async () => {
    render(<LoginAdmin />);
  
    const inputEmail = screen.getByPlaceholderText("Email");
    const inputPassword = screen.getByPlaceholderText("Senha");
    const button = screen.getByRole("button", { name: "Entrar" });
  
    await userEvent.type(inputEmail, "emailsemarroba");
    await userEvent.type(inputPassword, "Senha");
  
    await userEvent.tab(); 
    await userEvent.tab(); 

    await screen.findByText("Digite um email válido.");
  
    expect(screen.getByText("Digite um email válido.")).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
  

  test("não deve permitir senha inválida", async () => {
    render(<LoginAdmin />);
  
    const inputEmail = screen.getByPlaceholderText("Email");
    const inputPassword = screen.getByPlaceholderText("Senha");
    const button = screen.getByRole("button", { name: "Entrar" });

    await userEvent.type(inputEmail, "emailse@marroba.com");
    await userEvent.type(inputPassword, "senha");
    await userEvent.tab();
  
    expect(
      screen.getByText("A senha deve conter ao menos 1 letra maiúscula.")
    ).toBeInTheDocument();
  
    expect(button).toBeDisabled();
  });

  test("deve chamar alert quando email e senha são válidos", async () => {
    window.alert = vi.fn();
  
    render(<LoginAdmin />);
  
    const inputEmail = screen.getByPlaceholderText("Email");
    const inputPassword = screen.getByPlaceholderText("Senha");
    const button = screen.getByRole("button", { name: "Entrar" });
  
    await userEvent.type(inputEmail, "usuario@gmail.com");
    await userEvent.type(inputPassword, "SenhaValidaA");
  
    await userEvent.tab();
  
    expect(button).not.toBeDisabled();
  
    await userEvent.click(button);
  
    expect(window.alert).toHaveBeenCalledWith("Login válido");
  });

  test("o botão deve habilitar apenas quando ambos os campos são válidos", async () => {
    render(<LoginAdmin />);
    
    const inputEmail = screen.getByPlaceholderText("Email");
    const inputPassword = screen.getByPlaceholderText("Senha");
    const button = screen.getByRole("button", { name: "Entrar" });
    
    expect(button).toBeDisabled();

    await userEvent.type(inputEmail, "usuario@gmail.com");
    expect(button).toBeDisabled();
    
    await userEvent.type(inputPassword, "senha");
    expect(button).toBeDisabled(); 
    
    await userEvent.clear(inputPassword);
    await userEvent.type(inputPassword, "SenhaValida");
    expect(button).not.toBeDisabled(); 

    await userEvent.clear(inputEmail);
    await userEvent.type(inputEmail, "emailinvalido");
    expect(button).toBeDisabled();
  });

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
