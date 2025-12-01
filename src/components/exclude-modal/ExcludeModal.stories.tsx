import type { Meta, StoryObj } from "@storybook/react-vite";
import ExcludeModal from "./ExcludeModal";

const meta: Meta<typeof ExcludeModal> = {
  title: "Components/ExcludeModal",
  component: ExcludeModal,
  parameters: {
    layout: "centered",
  },
  args: {
    open: true,
    message: "Tem certeza que deseja excluir este item?",
    loading: false,
  },
  argTypes: {
    open: {
      control: "boolean",
      description: "Define se o modal está aberto",
    },
    message: {
      control: "text",
      description: "Mensagem exibida no corpo do modal",
    },
    loading: {
      control: "boolean",
      description: "`true` com o botão 'Excluir' mostrando 'Excluindo...'",
    },
    onClose: {
      action: "closed",
      description: "Função chamada ao clicar em 'Cancelar' ou no ícone de fechar",
    },
    onExclude: {
      action: "excluded",
      description: "Função chamada ao confirmar exclusão",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ExcludeModal>;

/**
 * Template base — Comportamento padrão
 */
export const Default: Story = {};

/**
 * Exibe o modal com uma mensagem customizada
 */
export const CustomMessage: Story = {
  args: {
    message: "Deseja realmente excluir o usuário selecionado?",
  },
};

/**
 * State de carregamento ao excluir
 */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

/**
 * Modal fechado (não renderiza)
 */
export const Closed: Story = {
  args: {
    open: false,
  },
};
