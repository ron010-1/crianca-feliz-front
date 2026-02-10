import type { Meta, StoryObj } from "@storybook/react-vite";
import TabelaVisitasView from "./TabelaVisitasView";
import type { VisitaType } from "../../models/visita";

const fotosBase = [
  "https://placehold.co/600x400/png?text=Foto+1",
  "https://placehold.co/600x400/png?text=Foto+2",
  "https://placehold.co/600x400/png?text=Foto+3",
];

const mockVisitas: VisitaType[] = Array.from({ length: 25 }).map((_, i) => {
  const idx = i + 1;
  return {
    id: `v${idx}`,
    data: `2025-02-${String((idx % 28) + 1).padStart(2, "0")}`,
    beneficiarioId: `b${(idx % 3) + 1}`,
    beneficiarioNome: `Beneficiário ${idx}`,
    evolucao: `Evolução registrada na visita ${idx}.`,
    acompanhamento_familiar: `Acompanhamento familiar ${idx}.`,
    estimulo_familiar: `Estímulo familiar ${idx}.`,
    fotos: idx % 3 === 0 ? fotosBase : idx % 2 === 0 ? fotosBase.slice(0, 2) : [],
  } as any;
});

const meta: Meta<typeof TabelaVisitasView> = {
  title: "Components/TabelaVisitas",
  component: TabelaVisitasView,
  args: {
    loading: false,
    online: true,
    visitas: mockVisitas.slice(0, 10),
    busca: "",
    onBuscaChange: (v) => console.log("Busca:", v),
    paginationDetails: {
      pagination: {
        page: 1,
        limit: 10,
        totalItens: mockVisitas.length,
      },
      onPageChange: (page) => alert(`Navegando para a página: ${page}`),
    },
    onNovo: () => console.log("Nova Visita"),
    onVerFotos: (v) => console.log("Ver fotos:", v),
    onEditar: (v) => console.log("Editar:", v),
    onDeletar: (v) =>
      new Promise<void>((resolve) =>
        setTimeout(() => {
          console.log("Deletar:", v);
          resolve();
        }, 1000)
      ),
  },
  argTypes: {
    loading: { control: "boolean" },
    online: { control: "boolean" },
    visitas: { control: "object" },
    paginationDetails: { control: "object" },
    busca: { control: "text" },
    onBuscaChange: { action: "digitou na busca" },
    onNovo: { action: "clicou em nova visita" },
    onVerFotos: { action: "clicou em ver fotos" },
    onEditar: { action: "clicou em editar" },
    onDeletar: { action: "clicou em excluir" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TabelaVisitasView>;

export const Default: Story = {
  args: {
    visitas: mockVisitas.slice(0, 10),
    paginationDetails: {
      pagination: {
        page: 1,
        limit: 10,
        totalItens: mockVisitas.length,
      },
      onPageChange: (page) => console.log(`Ir para página: ${page}`),
    },
  },
};

export const LoadingState: Story = {
  args: {
    loading: true,
    visitas: [],
    paginationDetails: undefined,
  },
};

export const EmptyState: Story = {
  args: {
    loading: false,
    visitas: [],
    paginationDetails: undefined,
  },
};

export const MiddlePage: Story = {
  args: {
    visitas: mockVisitas.slice(10, 20),
    paginationDetails: {
      pagination: {
        page: 2,
        limit: 10,
        totalItens: mockVisitas.length,
      },
      onPageChange: (page) => console.log(`Ir para página: ${page}`),
    },
  },
};

export const PaginationDisabled: Story = {
  args: {
    visitas: mockVisitas.slice(0, 5),
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

export const OfflineState: Story = {
  args: {
    online: false,
    visitas: mockVisitas.slice(0, 10),
    paginationDetails: {
      pagination: {
        page: 1,
        limit: 10,
        totalItens: mockVisitas.length,
      },
      onPageChange: (page) => console.log(`Ir para página: ${page}`),
    },
  },
};
