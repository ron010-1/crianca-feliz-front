import type { Meta, StoryObj } from "@storybook/react-vite";                                                    
import CustomTable from "./CustomTable";

type User = {
  id: number;
  name: string;
  age: number;
};

const sampleData: User[] = [
  { id: 1, name: "João", age: 22 },
  { id: 2, name: "Maria", age: 31 },
  { id: 3, name: "Carlos", age: 27 },
];

const TableUser = (props: React.ComponentProps<typeof CustomTable<User>>) => (
  <CustomTable<User> {...props} />
);

const meta: Meta<typeof TableUser> = {
  title: "Components/CustomTable",
  component: TableUser,
  args: {
    columns: [
      { name: "ID", accessor: (row) => row.id },
      { name: "Nome", accessor: (row) => row.name },
      { name: "Idade", accessor: (row) => row.age },
    ],
    data: sampleData,
  },
};

export default meta;
type Story = StoryObj<typeof TableUser>;


export const Default: Story = {};

export const Empty: Story = {
  args: { data: [] },
};

export const ManyColumns: Story = {
  args: {
    columns: [
      { name: "ID", accessor: (row) => row.id },
      { name: "Nome", accessor: (row) => row.name },
      { name: "Idade", accessor: (row) => row.age },
      { name: "Idade²", accessor: (row) => row.age * row.age },
      { name: "Maiúsculo", accessor: (row) => row.name.toUpperCase() },
    ],
  },
};
