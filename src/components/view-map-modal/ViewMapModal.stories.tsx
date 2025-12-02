import type { Meta, StoryObj } from "@storybook/react-vite";
import type { BeneficiarioType } from "../../models/beneficiario";
import ViewMapModal from "./ViewMapModal";

const sampleBeneficiario: BeneficiarioType = {
  id: 5,
  name: "Maria Eduarda Lima",
  responsavel: "Juliana Lima",
  dataNascimento: "18/01/2014",
  location: [-7.11532, -34.86145],
  telefone1: "(83) 99912-3322",
  telefone2: "(83) 98765-1122",
};

const meta: Meta<typeof ViewMapModal> = {
  title: "Components/ViewMapModal",
  component: ViewMapModal,
  args: {
    open: true,
    beneficiario: sampleBeneficiario,
  },
  argTypes: {
    open: {
      control: "boolean",
      description: "Define se o modal está aberto",
    },
    onClose: {
      action: "closed",
      description: "Função chamada ao clicar em 'Cancelar' ou no ícone de fechar",
    },
    beneficiario: {
      action: "",
      description: "Atributo para passar as informações do beneficiário que irá ser visualizado",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ViewMapModal>;

/**
 * Template base — Comportamento padrão
 */
export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ height: "400px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Modal fechado (não renderiza)
 */
export const Closed: Story = {
  args: {
    open: false,
  },
};
