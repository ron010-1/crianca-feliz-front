import type { Meta, StoryObj } from "@storybook/react-vite";
import TabelaBeneficiarios from "./TabelaBeneficiarios";
import type { BeneficiarioType } from "../../models/beneficiario";

const sampleBeneficiarios: BeneficiarioType[] = [
  {
    id: 1,
    name: "João Silva",
    responsavel: "Maria Silva",
    dataNascimento: "2005-03-20",
    location: [-23.55, -46.63],
    telefone1: "(11) 99999-9999",
  },
  {
    id: 2,
    name: "Ana Souza",
    responsavel: "Carlos Souza",
    dataNascimento: "2010-01-15",
    location: [-22.90, -43.20],
    telefone1: "(21) 98888-7777",
    telefone2: "(21) 33333-3333",
  },
];

const meta: Meta<typeof TabelaBeneficiarios> = {
  title: "Components/TabelaBeneficiarios",
  component: TabelaBeneficiarios,
  args: {
    beneficiarios: sampleBeneficiarios,
  },
  argTypes: {
    beneficiarios: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof TabelaBeneficiarios>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    beneficiarios: [],
  },
};
