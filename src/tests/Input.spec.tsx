import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginAdmin from "../pages/LoginAdmin";

describe("Testes de input", () =>{ 
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
});