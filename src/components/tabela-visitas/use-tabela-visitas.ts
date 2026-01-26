import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { VisitasRequests } from "../../api/visitas/visitasRequests";
import { BeneficiarioRequests } from "../../api/beneficiario/beneficiarioRequests";
import type { VisitaType } from "../../models/visita";
import { useAppSelector } from "../../hooks/useAppSelector";

export const useTabelaVisitas = () => {
  const queryClient = useQueryClient();
  const token = useAppSelector((state) => state.auth.token);

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalGaleriaOpen, setModalGaleriaOpen] = useState(false);
  const [visitaSelecionada, setVisitaSelecionada] = useState<VisitaType | null>(null);

  const visitasQuery = useQuery({
    queryKey: ["visitas"],
    queryFn: async () => {
      return await VisitasRequests.get(token!);
    },
    enabled: !!token,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const beneficiariosQuery = useQuery({
    queryKey: ["beneficiarios-lista"],
    queryFn: async () => {
      return await BeneficiarioRequests.get(token!);
    },
    enabled: !!token,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const visitas = useMemo(() => visitasQuery.data?.rows || [], [visitasQuery.data]);
  const beneficiariosLista = useMemo(
    () => beneficiariosQuery.data?.rows || [],
    [beneficiariosQuery.data]
  );

  const createVisitaMutation = useMutation({
    mutationKey: ["criar-visita"],
    mutationFn: async (novaVisita: Omit<VisitaType, "id">) => {
      return await VisitasRequests.create(novaVisita, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitas"] });
      toast.success("Visita agendada com sucesso!");
      setModalFormOpen(false);
    },
    onError: (error: any) => {
      const mensagem = error?.response?.data?.message || error?.message || "Erro ao agendar visita.";
      toast.error(mensagem);
    },
  });

  const updateVisitaMutation = useMutation({
    mutationKey: ["atualizar-visita"],
    mutationFn: async (visitaAtualizada: Partial<VisitaType> & { id: number }) => {
      return await VisitasRequests.update(visitaAtualizada, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitas"] });
      toast.success("Visita atualizada com sucesso!");
      setModalFormOpen(false);
    },
    onError: (error: any) => {
      const mensagem =
        error?.response?.data?.message || error?.message || "Erro ao atualizar visita.";
      toast.error(mensagem);
    },
  });

  const deleteVisitaMutation = useMutation({
    mutationKey: ["deletar-visita"],
    mutationFn: async (id: number) => {
      return await VisitasRequests.delete({ id, token: token! });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitas"] });
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

  const handleSalvar = (dados: Omit<VisitaType, "id">) => {
    if (!dados.beneficiarioId) {
      toast.warning("Selecione um beneficiário.");
      return;
    }

    if (visitaSelecionada) {
      updateVisitaMutation.mutate({ ...dados, id: visitaSelecionada.id });
      return;
    }

    createVisitaMutation.mutate(dados);
  };

  const handleConfirmarDelecao = () => {
    if (visitaSelecionada) {
      deleteVisitaMutation.mutate(visitaSelecionada.id);
    }
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
