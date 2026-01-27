import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { VisitasRequests } from "../../api/visitas/visitasRequests";
import { BeneficiarioRequests } from "../../api/beneficiario/beneficiarioRequests";
import type { VisitaType } from "../../models/visita";
import { useAppSelector } from "../../hooks/useAppSelector";

const getVisitaId = (visita: VisitaType): string | number | undefined => {
  const anyV = visita as any;
  return anyV.id ?? anyV.uuid ?? anyV._id ?? anyV.visitaId ?? anyV.visita_id;
};

export const useTabelaVisitas = () => {
  const queryClient = useQueryClient();
  const token = useAppSelector((state) => state.auth.token);

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalGaleriaOpen, setModalGaleriaOpen] = useState(false);
  const [visitaSelecionada, setVisitaSelecionada] = useState<VisitaType | null>(null);

  const visitasQuery = useQuery({
    queryKey: ["visitas"],
    queryFn: async () => await VisitasRequests.get(token!),
    enabled: !!token,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 10,
    gcTime: 1000 * 60 * 10,
  });

  const beneficiariosQuery = useQuery({
    queryKey: ["beneficiarios-lista"],
    queryFn: async () => await BeneficiarioRequests.get(token!),
    enabled: !!token,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const visitas = useMemo(() => visitasQuery.data?.rows || [], [visitasQuery.data]);
  const beneficiariosLista = useMemo(() => beneficiariosQuery.data?.rows || [], [beneficiariosQuery.data]);

  const createVisitaMutation = useMutation({
    mutationKey: ["criar-visita"],
    mutationFn: async (novaVisita: Omit<VisitaType, "id" | "uuid" | "_id">) => {
      return await VisitasRequests.create(novaVisita, token!);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["visitas"] });
      toast.success("Visita cadastrada com sucesso!");
      setModalFormOpen(false);
    },
    onError: (error: any) => {
      const mensagem = error?.response?.data?.message || error?.message || "Erro ao cadastrar visita.";
      toast.error(mensagem);
    },
  });

  const updateVisitaMutation = useMutation({
    mutationKey: ["atualizar-visita"],
    mutationFn: async (args: { id: string | number; visita: Omit<VisitaType, "id" | "uuid" | "_id"> }) => {
      return await VisitasRequests.update(args.id, args.visita, token!);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["visitas"] });
      toast.success("Visita atualizada com sucesso!");
      setModalFormOpen(false);
    },
    onError: (error: any) => {
      const mensagem = error?.response?.data?.message || error?.message || "Erro ao atualizar visita.";
      toast.error(mensagem);
    },
  });

  const deleteVisitaMutation = useMutation({
    mutationKey: ["deletar-visita"],
    mutationFn: async (id: string | number) => await VisitasRequests.delete(id, token!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["visitas"] });
      toast.success("Visita removida com sucesso!");
      setModalDeleteOpen(false);
    },
    onError: (error: any) => {
      const mensagem = error?.response?.data?.message || error?.message || "Erro ao remover visita.";
      toast.error(mensagem);
    },
  });

  const handleNovo = () => {
    setVisitaSelecionada(null);
    setModalFormOpen(true);
  };

  const handleEditar = (visita: VisitaType) => {
    const id = getVisitaId(visita);
    if (id === undefined || id === null || String(id).trim() === "") {
      toast.error("Esta visita não possui ID válido para edição.");
      return;
    }
    setVisitaSelecionada(visita);
    setModalFormOpen(true);
  };

  const handleDeletarClick = (visita: VisitaType) => {
    const id = getVisitaId(visita);
    if (id === undefined || id === null || String(id).trim() === "") {
      toast.error("Esta visita não possui ID válido para exclusão.");
      return;
    }
    setVisitaSelecionada(visita);
    setModalDeleteOpen(true);
  };

  const handleVerFotos = (visita: VisitaType) => {
    setVisitaSelecionada(visita);
    setModalGaleriaOpen(true);
  };

  const handleSalvar = (dados: Omit<VisitaType, "id" | "uuid" | "_id">) => {
    if (!dados.beneficiarioId) {
      toast.warning("Selecione um beneficiário.");
      return;
    }

    if (visitaSelecionada) {
      const id = getVisitaId(visitaSelecionada);
      if (id === undefined || id === null || String(id).trim() === "") {
        toast.error("Visita selecionada sem ID válido para atualização.");
        return;
      }
      updateVisitaMutation.mutate({ id, visita: dados });
      return;
    }

    createVisitaMutation.mutate(dados);
  };

  const handleConfirmarDelecao = () => {
    if (!visitaSelecionada) return;

    const id = getVisitaId(visitaSelecionada);
    if (id === undefined || id === null || String(id).trim() === "") {
      toast.error("Visita selecionada sem ID válido para exclusão.");
      return;
    }

    deleteVisitaMutation.mutate(id);
  };

  return {
    visitas,
    beneficiariosLista,
    isLoadingVisitas: visitasQuery.isLoading,
    isSuccessVisitas: visitasQuery.isSuccess,
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
