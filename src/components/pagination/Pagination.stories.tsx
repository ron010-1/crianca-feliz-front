import type { Meta, StoryObj } from "@storybook/react-vite";
import Pagination from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  args: {
    pagination: {
      page: 1,
      limit: 10,
      totalItens: 100,
    },
    handleItens: (page: number) => alert(`Navegando para a página: ${page}`),
  },
  argTypes: {
    pagination: { control: "object" },
    handleItens: { action: "page changed" },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const InitialPage: Story = {
  args: {
    pagination: {
      page: 1,
      limit: 10,
      totalItens: 100,
    },
  },
};

export const MiddlePage: Story = {
  args: {
    pagination: {
      page: 5,
      limit: 10,
      totalItens: 100,
    },
  },
};

export const LastPage: Story = {
  args: {
    pagination: {
      page: 10,
      limit: 10,
      totalItens: 100,
    },
  },
};

export const EdgeCaseFewItems: Story = {
  args: {
    pagination: {
      page: 1,
      limit: 10,
      totalItens: 9,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "O componente de paginação não deve ser renderizado se totalItens for menor ou igual ao limit.",
      },
    },
  },
};

export const CustomLimit: Story = {
  args: {
    pagination: {
      page: 2,
      limit: 25,
      totalItens: 100,
    },
  },
};
