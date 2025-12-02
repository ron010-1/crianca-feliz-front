import type { Meta, StoryObj } from "@storybook/react-vite";
import Loading from "./Loading";

const meta: Meta<typeof Loading> = {
  title: "Components/Loading",
  component: Loading,
  args: {
    message: "carregando...",
    size: "md",
  },
  argTypes: {
    message: { control: "text", description: "Mensagem exibida abaixo do spinner." },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Define o tamanho (small, medium, large) do spinner e da mensagem.",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Loading>;

/**
 * História Padrão (Tamanho Médio)
 */
export const Default: Story = {
  args: {
    message: "Aguardando dados...",
    size: "md",
  },
};

/**
 * História para o Tamanho Pequeno (sm)
 */
export const Small: Story = {
  args: {
    message: "Processando...",
    size: "sm",
  },
};

/**
 * História para o Tamanho Grande (lg)
 */
export const Large: Story = {
  args: {
    message: "Carregamento de dados críticos. Por favor, aguarde.",
    size: "lg",
  },
};

/**
 * História Sem Mensagem (usando o valor padrão "carregando...")
 */
export const NoMessage: Story = {
  args: {
    message: undefined,
    size: "md",
  },
};
