import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

describe("Tabela de beneficiários", () => {

    test("deve deletar um beneficiário", async () => {
        render(<App />);

        const botoesDelete = await screen.findAllByRole("button", { name: "Deletar beneficiario" });
        expect(botoesDelete.length).toBeGreaterThan(0);

        await userEvent.click(botoesDelete[0]);

        const btnConfirmacao = await screen.findByRole("button", { name: "Excluir" });
        expect(btnConfirmacao).toBeInTheDocument();

        await userEvent.click(btnConfirmacao);
    });

    test("deve cancelar no modal de confimação ao tentar deletar um beneficiário", async () => {
        render(<App />);

        const botoesDelete = await screen.findAllByRole("button", { name: "Deletar beneficiario" });

        expect(botoesDelete.length).toBeGreaterThan(0);

        await userEvent.click(botoesDelete[0]);

        const btnCancelar = await screen.findByRole("button", { name: "Cancelar" });
        expect(btnCancelar).toBeInTheDocument();

        await userEvent.click(btnCancelar);
    });

    test("deve abrir o mapa da localização do beneficiário", async () => {
        render(<App />);

        const botoesMapas = await screen.findAllByRole("button", { name: "Acessar localização" });
        expect(botoesMapas.length).toBeGreaterThan(0);

        await userEvent.click(botoesMapas[0]);

        const modal = await screen.findByRole("dialog");
        expect(modal).toBeInTheDocument();
    });

    test("deve abrir o mapa da localização do beneficiário e fechar", async () => {
        render(<App />);

        const botoesMapas = await screen.findAllByRole("button", { name: "Acessar localização" });
        expect(botoesMapas.length).toBeGreaterThan(0);

        await userEvent.click(botoesMapas[0]);

        const modal = await screen.findByRole("dialog");
        expect(modal).toBeInTheDocument();

        const bntFechar = await screen.findByRole("button", { name: "Fechar" });
        expect(bntFechar).toBeInTheDocument();

        await userEvent.click(bntFechar);
    });
});
