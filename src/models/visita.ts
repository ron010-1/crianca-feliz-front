export interface VisitaType {
  id?: number | string;
  uuid?: string;
  _id?: string;
  data: string;
  beneficiarioId: string;
  beneficiarioNome: string;
  evolucao: string;
  acompanhamento_familiar: string;
  estimulo_familiar: string;
  fotos: string[];
}

export interface VisitaUpsertPayload {
  data: string;
  beneficiarioId: string;
  beneficiarioNome?: string;
  evolucao: string;
  acompanhamento_familiar: string;
  estimulo_familiar: string;
  fotosFiles: File[];
}
