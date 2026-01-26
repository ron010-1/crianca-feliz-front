import type { VisitaType } from "../../models/visita";
import type { BaseListagemType } from "../../models/global";
import { provider } from "../provider";

export class VisitasRequests {
  static async get(token: string): Promise<BaseListagemType<VisitaType>> {
    const { data } = await provider.get<BaseListagemType<VisitaType>>(`/visitas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }

  static async create(visita: Omit<VisitaType, "id">, token: string): Promise<VisitaType> {
    if (!visita.beneficiarioId) {
      throw new Error("ID do beneficiário é obrigatório.");
    }

    const payload = {
      data: visita.data,
      imagens: visita.fotos || [],
      evolucao: visita.evolucao || "Sem evolução registrada",
      acompanhamento_familiar: visita.acompanhamento_familiar || "N/A",
      estimulo_familiar: visita.estimulo_familiar || "N/A",
      beneficiarioId: visita.beneficiarioId,
    };

    const { data } = await provider.post<VisitaType>(`/visitas`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  }

  static async update(
    visita: Partial<VisitaType> & { id: number },
    token: string
  ): Promise<VisitaType> {
    const payload = {
      data: visita.data,
      imagens: visita.fotos || [],
      evolucao: visita.evolucao,
      acompanhamento_familiar: visita.acompanhamento_familiar,
      estimulo_familiar: visita.estimulo_familiar,
      beneficiarioId: visita.beneficiarioId,
    };

    const { data } = await provider.put<VisitaType>(`/visitas/${visita.id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  }

  static async delete({ id, token }: { id: number; token: string }): Promise<void> {
    await provider.delete(`/visitas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
