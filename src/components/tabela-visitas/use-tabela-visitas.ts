import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { VisitasRequests } from "../../api/visitas/visitasRequests";
import { BeneficiarioRequests } from "../../api/beneficiario/beneficiarioRequests";
import { authConstants } from "../../constants/auth.constants";
import type { VisitaType } from "../../models/visita";

const STORAGE_KEY = "visitas_fotos_by_id";

const readFotosStorage = (): Record<string, string[]> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, string[]>;
  } catch {
    return {};
  }
};

const writeFotosStorage = (data: Record<string, string[]>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const saveFotosForVisita = (visitaId: string | number, fotos: string[]) => {
  const key = String(visitaId);
  const store = readFotosStorage();
  store[key] = Array.isArray(fotos) ? fotos.filter(Boolean) : [];
  writeFotosStorage(store);
};

const mergeFotosFromStorage = (visitas: VisitaType[]) => {
  const store = readFotosStorage();
  return (visitas || []).map((v) => {
    const key = String(v.id);
    const fotos = Array.isArray(v.fotos) && v.fotos.length ? v.fotos : store[key] || [];
    return { ...v, fotos };
  });
};

export const useTabelaVisitas = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem(authConstants.NAME_TOKEN_IN_STORAGE);

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalGaleriaOpen, setModalGaleriaOpen] = useState(false);
  const [visitaSelecionada, setVisitaSelecionada] = useState<VisitaType | null>(null);

  const visitasQuery = useQuery({
    queryKey: ["visitas"],
    queryFn: async () => {
      if (!token) return { count: 0, rows: [] as VisitaType[] };
      const res = await VisitasRequests.get(token);
      return { ...res, rows: mergeFotosFromStorage(res.rows || []) };
    },
    enabled: !!token,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const beneficiariosQuery = useQuery({
    queryKey: ["beneficiarios-lista"],
    queryFn: async () => {
      if (!token) return { count: 0, rows: [] };
      return await BeneficiarioRequests.get(token);
    },
    enabled: !!token,
  });

  const visitas = useMemo(() => visitasQuery.data?.rows || [], [visitasQuery.data]);
  const beneficiariosLista = useMemo(() => beneficiariosQuery.data?.rows || [], [beneficiariosQuery.data]);

  const createVisitaMutation = useMutation({
    mutationFn: async (novaVisita: Partial<VisitaType>) => {
      const payload = novaVisita as Omit<VisitaType, "id">;
      return await VisitasRequests.create(payload, token!);
    },
    mutationKey: ["criar-visita"],
    onSuccess: (data, variables) => {
      const fotos = Array.isArray((variables as any)?.fotos) ? ((variables as any).fotos as string[]) : [];
      if (data?.id != null && fotos.length) saveFotosForVisita(data.id, fotos);

      queryClient.setQueryData(["visitas"], (old: any) => {
        const rows = Array.isArray(old?.rows) ? old.rows : [];
        const next = mergeFotosFromStorage([{ ...data, fotos }, ...rows]);
        return { ...old, rows: next };
      });

      queryClient.invalidateQueries({ queryKey: ["visitas"] });
      toast.success("Visita agendada com sucesso!");
      setModalFormOpen(false);
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.message || "Erro ao agendar visita.";
      toast.error(mensagem);
    },
  });

  const updateVisitaMutation = useMutation({
    mutationFn: async (visitaAtualizada: Partial<VisitaType>) => {
      const id = (visitaAtualizada as any)?.id ?? visitaSelecionada?.id;
      if (id == null) throw new Error("ID inválido para atualização.");
      const payload = { ...(visitaAtualizada as any) } as VisitaType;
      const body: Omit<VisitaType, "id"> = {
        data: payload.data,
        beneficiarioId: payload.beneficiarioId,
        beneficiarioNome: payload.beneficiarioNome,
        evolucao: payload.evolucao,
        acompanhamento_familiar: payload.acompanhamento_familiar,
        estimulo_familiar: payload.estimulo_familiar,
        fotos: Array.isArray(payload.fotos) ? payload.fotos : [],
      };
      return await VisitasRequests.update(id, body, token!);
    },
    mutationKey: ["atualizar-visita"],
    onSuccess: (data, variables) => {
      const id = (variables as any)?.id ?? visitaSelecionada?.id ?? data?.id;
      const fotos = Array.isArray((variables as any)?.fotos) ? ((variables as any).fotos as string[]) : [];
      if (id != null && fotos.length) saveFotosForVisita(id, fotos);

      queryClient.setQueryData(["visitas"], (old: any) => {
        const rows: VisitaType[] = Array.isArray(old?.rows) ? old.rows : [];
        const nextRows = rows.map((r) => (String(r.id) === String(id) ? ({ ...(r as any), ...(data || variables), fotos } as any) : r));
        return { ...old, rows: mergeFotosFromStorage(nextRows) };
      });

      queryClient.invalidateQueries({ queryKey: ["visitas"] });
      toast.success("Visita atualizada com sucesso!");
      setModalFormOpen(false);
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.message || "Erro ao atualizar visita.";
      toast.error(mensagem);
    },
  });

  const deleteVisitaMutation = useMutation({
    mutationFn: async (id: any) => {
      return await VisitasRequests.delete(id, token!);
    },
    mutationKey: ["deletar-visita"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitas"] });
      toast.success("Visita removida com sucesso!");
      setModalDeleteOpen(false);
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.message || "Erro ao remover visita.";
      toast.error(mensagem);
    },
  });

  const handleNovo = () => {
    setVisitaSelecionada(null);
    setModalFormOpen(true);
  };

  const handleEditar = (visita: VisitaType) => {
    setVisitaSelecionada(visita);
    setModalFormOpen(true);
  };

  const handleDeletarClick = (visita: VisitaType) => {
    setVisitaSelecionada(visita);
    setModalDeleteOpen(true);
  };

  const handleVerFotos = (visita: VisitaType) => {
    setVisitaSelecionada(visita);
    setModalGaleriaOpen(true);
  };

  const handleSalvar = (dados: Partial<VisitaType>) => {
    if (!dados.beneficiarioId) {
      toast.warning("Selecione um beneficiário.");
      return;
    }

    if (visitaSelecionada) {
      updateVisitaMutation.mutate({ ...dados, id: visitaSelecionada.id });
    } else {
      createVisitaMutation.mutate(dados);
    }
  };

  const handleConfirmarDelecao = () => {
    if (visitaSelecionada) {
      deleteVisitaMutation.mutate(visitaSelecionada.id);
    }
  };

  return {
    visitasData: visitasQuery.data,
    visitas,
    beneficiariosLista,
    isLoadingVisitas: visitasQuery.isLoading,
    isSuccessVisitas: visitasQuery.isSuccess,
    isError: visitasQuery.isError,
    isSaving: createVisitaMutation.isPending || updateVisitaMutation.isPending,
    isDeleting: deleteVisitaMutation.isPending,
    modalFormOpen,
    setModalFormOpen,
    modalDeleteOpen,
    setModalDeleteOpen,
    modalGaleriaOpen,
    setModalGaleriaOpen,
    visitaSelecionada,
    handleNovo,
    handleEditar,
    handleDeletarClick,
    handleVerFotos,
    handleSalvar,
    handleConfirmarDelecao,
  };
};
