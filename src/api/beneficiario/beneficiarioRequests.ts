import type { BeneficiarioType, CreateBeneficiarioType } from "../../models/beneficiario";
import type { BaseListagemType } from "../../models/global";
import { provider } from "../provider";

export class BeneficiarioRequests {
  private static BASE_ROUTE = "/benefs";

  static async get(token: string): Promise<BaseListagemType<BeneficiarioType>> {
    const { data } = await provider.get(`${this.BASE_ROUTE}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  }

  static async getById({ token, id }: { id: string; token: string }): Promise<BeneficiarioType> {
    const { data } = await provider.get(`${this.BASE_ROUTE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  }

  static async create({
    beneficiarioData,
    token,
  }: {
    beneficiarioData: CreateBeneficiarioType;
    token: string;
  }): Promise<BeneficiarioType> {
    const { data } = await provider.post(`${this.BASE_ROUTE}`, beneficiarioData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  }

  static async edit({
    beneficiarioData,
    token,
    id,
  }: {
    id: string;
    beneficiarioData: Partial<CreateBeneficiarioType>;
    token: string;
  }): Promise<BeneficiarioType> {
    const { data } = await provider.patch(`${this.BASE_ROUTE}/${id}`, beneficiarioData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  }

  static async delete({ id, token }: { id: string; token: string }): Promise<string> {
    const { data } = await provider.delete(`${this.BASE_ROUTE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  }
}
