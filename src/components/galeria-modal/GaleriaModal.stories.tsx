import type { Meta, StoryObj } from "@storybook/react-vite";
import GaleriaModal from "./GaleriaModal";

const fotosMock = [
  "https://placehold.co/700x450/png?text=Visita+01",
  "https://placehold.co/700x450/png?text=Visita+02",
  "https://placehold.co/700x450/png?text=Visita+03",
];

const meta: Meta<typeof GaleriaModal> = {
  title: "Components/GaleriaModal",
  component: GaleriaModal,
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    titulo: "Maria da Silva",
    fotos: fotosMock,
    onClose: () => {},
  },
  argTypes: {
    open: { control: "boolean" },
    titulo: { control: "text" },
    fotos: { control: "object" },
    onClose: { action: "closed" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GaleriaModal>;

export const Default: Story = {};

export const EmptyFotos: Story = {
  args: { fotos: [] },
};

export const Closed: Story = {
  args: { open: false },
};
