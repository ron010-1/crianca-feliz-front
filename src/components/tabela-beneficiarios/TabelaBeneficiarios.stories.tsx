import type { Meta, StoryObj } from "@storybook/react-vite";
import TabelaBeneficiarios from "./TabelaBeneficiarios";
import type { BeneficiarioType } from "../../models/beneficiario";
import beneficarios from "../../mocks/beneficiarios.json";

const mockBeneficiarios: BeneficiarioType[] = beneficarios;

const meta: Meta<typeof TabelaBeneficiarios> = {
  title: "Components/TabelaBeneficiarios",
  component: TabelaBeneficiarios,
  args: {
    loading: false,
    beneficiarios: mockBeneficiarios.slice(0, 10),
    paginationDetails: {
      pagination: {
        page: 1,
        limit: 10,
        totalItens: mockBeneficiarios.length,
      },
      onPageChange: (page) => alert(`Navegando para a página: ${page}`),
    },
  },
  argTypes: {
    loading: { control: "boolean" },
    beneficiarios: { control: "object" },
    paginationDetails: { control: "object" },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TabelaBeneficiarios>;

/**
 * Estado padrão: Exibe a tabela com dados e paginação (página inicial).
 */
export const Default: Story = {
  args: {
    beneficiarios: mockBeneficiarios.slice(0, 10),
    paginationDetails: {
      pagination: {
        page: 1,
        limit: 10,
        totalItens: mockBeneficiarios.length,
      },
      onPageChange: (page) => console.log(`Ir para página: ${page}`),
    },
  },
};

/**
 * Estado de Carregamento: Exibe o componente de `Loading`.
 */
export const LoadingState: Story = {
  args: {
    loading: true,
    beneficiarios: [],
  },
};

/**
 * Estado Vazio: Exibe o componente `Empty` quando não há dados.
 */
export const EmptyState: Story = {
  args: {
    loading: false,
    beneficiarios: [],
    paginationDetails: undefined,
  },
};

/**
 * Paginação no Meio: Simula a visualização de uma página intermediária.
 */
export const MiddlePage: Story = {
  args: {
    beneficiarios: mockBeneficiarios.slice(10, 20),
    paginationDetails: {
      pagination: {
        page: 2,
        limit: 10,
        totalItens: 25,
      },
      onPageChange: (page) => console.log(`Ir para página: ${page}`),
    },
  },
};

/**
 * Paginação Desativada: Quando o total de itens não justifica a paginação.
 */
export const PaginationDisabled: Story = {
  args: {
    beneficiarios: mockBeneficiarios.slice(0, 5),
    paginationDetails: {
      pagination: {
        page: 1,
        limit: 10,
        totalItens: 5,
      },
      onPageChange: (page) => console.log(`Ir para página: ${page}`),
    },
  },
};
