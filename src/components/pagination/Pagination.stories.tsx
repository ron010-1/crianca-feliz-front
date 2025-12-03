import type { Meta, StoryObj } from "@storybook/react-vite";
import Pagination from "./Pagination";
import { useState } from "react";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  render: (args) => {
    const Wrapper = () => {
      const [page, setPage] = useState(args.pagination.page);

      return (
        <Pagination
          {...args}
          pagination={{
            ...args.pagination,
            page,
          }}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      );
    };

    return <Wrapper />;
  },
  args: {
    pagination: {
      page: 1,
      limit: 10,
      totalItens: 100,
    },
  },
  argTypes: {
    pagination: { control: "object" },
    onPageChange: { action: "page changed" },
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
