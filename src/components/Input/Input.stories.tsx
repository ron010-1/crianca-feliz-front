import type { Meta, StoryObj } from "@storybook/react-vite";
import Input from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Um input controlado simples, que recebe valor e callback para atualização. Suporta placeholder e diferentes tipos de entrada.",
      },
    },
  },
  args: {
    value: "",
    placeholder: "Digite algo...",
    type: "text",
  },
  argTypes: {
    value: {
      control: "text",
      description: "Valor do input (controlado)",
    },
    placeholder: {
      control: "text",
      description: "Texto de placeholder exibido quando vazio",
    },
    type: {
      control: "text",
      description: "Tipo do input, ex: text, number, email, password",
    },
    onChange: {
      action: "changed",
      description: "Função chamada ao alterar o valor",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

/**
 * Template padrão
 */
export const Default: Story = {
  args: {
    value: "",
  },
};

/**
 * Input com valor inicial
 */
export const WithValue: Story = {
  args: {
    value: "Texto inicial",
  },
};

/**
 * Diferentes tipos de input
 */
export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Digite sua senha",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Somente números",
  },
};
