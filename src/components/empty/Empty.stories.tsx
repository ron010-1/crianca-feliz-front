import type { Meta, StoryObj } from "@storybook/react-vite";
import Empty from "./Empty";
import { FaRegFolderOpen, FaBoxes } from "react-icons/fa";
import { BsCardList } from "react-icons/bs";

const meta: Meta<typeof Empty> = {
  title: "Components/Empty State",
  component: Empty,
  args: {
    message: "Nenhum item encontrado",
    subtext: "Verifique seus filtros ou adicione novos itens para preencher esta lista.",
    icon: FaRegFolderOpen,
    size: "md",
    noBackground: false,
  },
  argTypes: {
    message: { control: "text" },
    subtext: { control: "text" },
    icon: {
      control: "select",
      options: [FaRegFolderOpen, FaBoxes, BsCardList],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    noBackground: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Empty>;

/**
 * História Padrão (Tamanho Médio com fundo e ícone padrão)
 */
export const Default: Story = {};

/**
 * História de Tamanho Pequeno (sm)
 */
export const SmallSize: Story = {
  args: {
    size: "sm",
    message: "Lista vazia",
    subtext: "Adicione items.",
  },
};

/**
 * História de Tamanho Grande (lg)
 */
export const LargeSize: Story = {
  args: {
    size: "lg",
    icon: FaBoxes,
    message: "Ops! Não há produtos em estoque.",
    subtext: "Entre em contato com o suporte para mais informações.",
  },
};

/**
 * História Sem Fundo (para ser usada em cards ou fundos coloridos)
 */
export const NoBackground: Story = {
  args: {
    noBackground: true,
    message: "Resultado da busca não encontrado",
    subtext: "Tente novamente com outros termos.",
  },
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#f0f0f0" },
        { name: "dark", value: "#333333" },
      ],
    },
  },
};

/**
 * História com Ícone Alternativo e Sem Subtexto
 */
export const AlternativeIcon: Story = {
  args: {
    icon: BsCardList,
    message: "Nenhum filtro aplicado",
    subtext: undefined,
    size: "sm",
  },
};
