export type StatusVisita = "Realizada" | "Agendada" | "Cancelada";

export interface VisitaType {
  id: number;
  data: string;
  beneficiarioId: string; 
  beneficiarioNome: string;
  status: StatusVisita;
  observacao: string;
  fotos?: string[];
}