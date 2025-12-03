import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginAdmin from "../pages/LoginAdmin";

describe("Testes de botão", () => {
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
});