import type { Meta, StoryObj } from "@storybook/react-vite";
import TabelaAssistentes, { type AssistenteType } from "./TabelaAssistentes";

const mockAssistentes: AssistenteType[] = Array.from({ length: 25 }).map((_, i) => ({
  id: (i + 1).toString(),
  nome: `Assistente Social ${i + 1}`,
  email: `assistente${i + 1}@cras.gov.br`,
  telefone: `(11) 99999-${(1000 + i).toString()}`,
}));

const meta: Meta<typeof TabelaAssistentes> = {
  title: "Components/TabelaAssistentes",
  component: TabelaAssistentes,
  args: {
    loading: false,
    assistentes: mockAssistentes.slice(0, 10),
    paginationDetails: {
      pagination: {
        page: 1,
        limit: 10,
        totalItens: mockAssistentes.length,
      },
      onPageChange: (page) => alert(`Navegando para a página: ${page}`),
    },
    onEdit: (assistente) => console.log("Editar assistente:", assistente),
    onDelete: (id) => new Promise((resolve) => setTimeout(() => {
        console.log("Deletar ID:", id);
        resolve();
    }, 1000)),
  },
  argTypes: {
    loading: { control: "boolean" },
    assistentes: { control: "object" },
    paginationDetails: { control: "object" },
    onEdit: { action: "clicou em editar" },
    onDelete: { action: "clicou em excluir" },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TabelaAssistentes>;


export const Default: Story = {
  args: {
    assistentes: mockAssistentes.slice(0, 10),
    paginationDetails: {
      pagination: {
        page: 1,
        limit: 10,
        totalItens: mockAssistentes.length,
      },
      onPageChange: (page) => console.log(`Ir para página: ${page}`),
    },
  },
};


export const LoadingState: Story = {
  args: {
    loading: true,
    assistentes: [],
  },
};


export const EmptyState: Story = {
  args: {
    loading: false,
    assistentes: [],
    paginationDetails: undefined,
  },
};


export const MiddlePage: Story = {
  args: {
    assistentes: mockAssistentes.slice(10, 20),
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


export const PaginationDisabled: Story = {
  args: {
    assistentes: mockAssistentes.slice(0, 5),
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