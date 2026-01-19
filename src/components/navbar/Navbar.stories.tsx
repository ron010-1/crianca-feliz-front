import type { Meta, StoryObj } from "@storybook/react-vite";
import Navbar from "./Navbar";

const meta: Meta<typeof Navbar> = {
  title: "Components/Layout/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    brandName: "Minha Empresa",
    logoUrl: "https://placehold.co/40x40/png", 
  },
  argTypes: {
    brandName: { control: "text", description: "Nome da marca exibido ao lado do logo" },
    logoUrl: { control: "text", description: "URL da imagem do logo" },
    buttons: { description: "Lista de botões (máximo de 2 são renderizados)" },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    buttons: [
      {
        label: "Entrar",
        onClick: () => console.log("Clicou em Entrar"),
        variant: "secondary",
      },
      {
        label: "Cadastrar",
        onClick: () => console.log("Clicou em Cadastrar"),
        variant: "primary",
      },
    ],
  },
};

export const SingleAction: Story = {
  args: {
    buttons: [
      {
        label: "Sair",
        onClick: () => console.log("Clicou em Sair"),
        variant: "danger",
      },
    ],
  },
};


export const NoButtons: Story = {
  args: {
    buttons: [],
  },
};

export const SliceTest: Story = {
  args: {
    buttons: [
      { label: "Botão 1", onClick: () => {}, variant: "primary" },
      { label: "Botão 2", onClick: () => {}, variant: "secondary" },
      { label: "Botão 3 (Invisível)", onClick: () => {}, variant: "danger" }, 
    ],
  },
};