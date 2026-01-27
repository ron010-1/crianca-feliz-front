import type { VisitaType } from "../../models/visita";
import type { BaseListagemType } from "../../models/global";
import { provider } from "../provider";

type ApiVisita = any;

const normalizeDateToYmd = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    if (value.includes("T")) return value.slice(0, 10);
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return "";
  }
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return "";
};

const getApiBaseUrl = () => {
  const anyProvider = provider as any;
  const base = anyProvider?.defaults?.baseURL;
  return typeof base === "string" ? base.replace(/\/+$/, "") : "";
};

const normalizeImageUrl = (value: any): string => {
  if (!value) return "";
  const s = String(value);

  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  const base = getApiBaseUrl();
  if (!base) return s;

  if (s.startsWith("/")) return `${base}${s}`;
  return `${base}/${s}`;
};

const mapApiToVisita = (raw: ApiVisita): VisitaType => {
  const id = raw?.id ?? raw?.uuid ?? raw?._id ?? raw?.visitaId ?? raw?.visita_id;

  const beneficiarioId = raw?.beneficiarioId ?? raw?.beneficiario_id ?? "";
  const beneficiarioNome = raw?.beneficiarioNome ?? raw?.beneficiario_nome ?? "";

  const images =
    raw?.images ??
    raw?.imagens ??
    raw?.fotos ??
    raw?.photos ??
    raw?.imagensUrls ??
    raw?.imagens_urls ??
    [];

  const fotos: string[] = Array.isArray(images)
    ? images.map((x: any) => normalizeImageUrl(x)).filter(Boolean)
    : [];

  const dateRaw =
    raw?.date ??
    raw?.data ??
    raw?.dataVisita ??
    raw?.data_visita ??
    raw?.createdAt ??
    raw?.created_at;

  const data = normalizeDateToYmd(dateRaw);

  return {
    id,
    data,
    beneficiarioId: String(beneficiarioId || ""),
    beneficiarioNome: String(beneficiarioNome || ""),
    evolucao: String(raw?.evolucao ?? ""),
    acompanhamento_familiar: String(raw?.acompanhamento_familiar ?? ""),
    estimulo_familiar: String(raw?.estimulo_familiar ?? ""),
    fotos,
  };
};

const buildPayload = (visita: Omit<VisitaType, "id" | "uuid" | "_id">) => {
  return {
    date: normalizeDateToYmd(visita.data),
    images: visita.fotos || [],
    evolucao: visita.evolucao,
    acompanhamento_familiar: visita.acompanhamento_familiar,
    estimulo_familiar: visita.estimulo_familiar,
    beneficiarioId: visita.beneficiarioId,
  };
};

export class VisitasRequests {
  static async get(token: string): Promise<BaseListagemType<VisitaType>> {
    const { data } = await provider.get<BaseListagemType<ApiVisita>>(`/visitas`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const rows = (data?.rows || []).map(mapApiToVisita);

    return {
      ...data,
      rows,
    };
  }

  static async create(
    visita: Omit<VisitaType, "id" | "uuid" | "_id">,
    token: string
  ): Promise<VisitaType> {
    const payload = buildPayload(visita);

    const { data } = await provider.post<ApiVisita>(`/visitas`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return mapApiToVisita(data);
  }

  static async update(
    id: string | number,
    visita: Omit<VisitaType, "id" | "uuid" | "_id">,
    token: string
  ): Promise<VisitaType | null> {
    if (id === undefined || id === null || String(id).trim() === "") {
      throw new Error("ID da visita inválido para atualização.");
    }

    const payload = buildPayload(visita);

    const res = await provider.patch<ApiVisita>(`/visitas/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    if (!res.data) return null;
    return mapApiToVisita(res.data);
  }

  static async delete(id: string | number, token: string): Promise<void> {
    if (id === undefined || id === null || String(id).trim() === "") {
      throw new Error("ID da visita inválido para exclusão.");
    }

    await provider.delete(`/visitas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
