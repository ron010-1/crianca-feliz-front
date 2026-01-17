export type StatusVisita = "Realizada" | "Agendada" | "Cancelada";

export interface VisitaType {
  id: number;
  data: string;
  beneficiarioId: number;
  beneficiarioNome: string;
  status: StatusVisita;
  observacao: string;
}