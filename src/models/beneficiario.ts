import type { Nullable } from "./global";

export type BeneficiarioType = {
  uuid: string;
  nome: string;
  nome_responsavel: string;
  data_nascimento: string;
  phone1: string;
  phone2: Nullable<string>;
  location: GeoPoint;
  assistenteId: Nullable<string>;
  createdAt: string;
  updatedAt: string;
};

export type GeoPoint = {
  type: string;
  coordinates: number[];
};

export type CreateBeneficiarioType = Omit<BeneficiarioType, "uuid" | "assistenteId" | "createdAt" | "updatedAt">;
