import type { Meta, StoryObj } from "@storybook/react-vite";
import ConfirmModal from "./ConfirmModal";

const meta: Meta<typeof ConfirmModal> = {
  title: "Components/ExcludeModal",
  component: ConfirmModal,
  parameters: {
    layout: "centered",
  },
  args: {
    open: true,
    message: <span>Tem certeza que deseja excluir este item?</span>,
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
    onAction: {
      action: "excluded",
      description: "Função chamada ao confirmar exclusão",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ConfirmModal>;

/**
 * Template base — Comportamento padrão
 */
export const Default: Story = {};

/**
 * Exibe o modal com uma mensagem customizada
 */
export const CustomMessage: Story = {
  args: {
    message: <span>Deseja realmente excluir o usuário selecionado?</span>,
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
