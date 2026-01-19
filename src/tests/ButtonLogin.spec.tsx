import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import LoginAdmin from "../pages/LoginAdmin";

describe("Testes de botão - LoginAdmin", () => {

  const setup = async () => {
    const user = userEvent.setup();

    render(<LoginAdmin />);

    return {
      user,
      inputEmail: screen.getByPlaceholderText(/email/i),
      inputPassword: screen.getByPlaceholderText(/senha/i),
      button: screen.getByRole("button", { name: /entrar/i }),
    };
  };

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("deve chamar alert quando email e senha são válidos", async () => {
    const alertSpy = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    const { user, inputEmail, inputPassword, button } = await setup();

    await user.type(inputEmail, "usuario@gmail.com");
    await user.type(inputPassword, "SenhaValidaA");

    expect(button).toBeEnabled();

    await user.click(button);

    expect(alertSpy).toHaveBeenCalledWith("Login válido");
  });

  it("o botão deve habilitar apenas quando ambos os campos são válidos", async () => {
    const { user, inputEmail, inputPassword, button } = await setup();

    expect(button).toBeDisabled();

    await user.type(inputEmail, "usuario@gmail.com");
    expect(button).toBeDisabled();

    await user.type(inputPassword, "senha");
    expect(button).toBeDisabled();

    await user.clear(inputPassword);
    await user.type(inputPassword, "SenhaValida");
    expect(button).toBeEnabled();

    await user.clear(inputEmail);
    await user.type(inputEmail, "emailinvalido");
    expect(button).toBeDisabled();
  });
});
