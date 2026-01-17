import type { BeneficiarioType } from "../../models/beneficiario";
import type { BaseListagemType } from "../../models/global";
import { provider } from "../provider";

export class BeneficiarioRequests {
  static async get(token: string): Promise<BaseListagemType<BeneficiarioType>> {
    const { data } = await provider.get(`/benefs`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  }

  static async delete({ id, token }: { id: string; token: string }): Promise<string> {
    const { data } = await provider.delete(`/benefs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  }
}
