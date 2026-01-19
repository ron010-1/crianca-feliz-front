import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import type { BeneficiarioType } from "../../models/beneficiario";
import { BeneficiarioRequests } from "../../api/beneficiario/beneficiarioRequests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authConstants } from "../../constants/auth.constants";
import type { PaginationType } from "../../models/global";
import { beneficiarioConstants } from "../../constants/beneficiario.constants";

export const useTabelaBeneficiarios = () => {
  const queryClient = useQueryClient();
  const [openExcludeModal, setOpenExcludeModal] = useState<boolean>(false);
  const [openMapModal, setOpenMapModal] = useState<boolean>(false);
  const [beneficiario, setBeneficiario] = useState<BeneficiarioType | null>(null);
  const token = localStorage.getItem(authConstants.NAME_TOKEN_IN_STORAGE);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: beneficiarioConstants.BENEFS_PER_PAGE,
    totalItens: 0,
  });

  const {
    data: beneficiariosData,
    isLoading: isLoadingBeneficiarios,
    isSuccess: isSuccessBeneficiarios,
  } = useQuery({
    queryKey: ["beneficiarios"],
    queryFn: async () => {
      return await BeneficiarioRequests.get(token!);
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const beneficiarios: BeneficiarioType[] = useMemo(() => {
    if (beneficiariosData && beneficiariosData) {
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;

      return beneficiariosData.rows.slice(startIndex, endIndex) as BeneficiarioType[];
    }

    return [];
  }, [pagination, beneficiariosData]);

  const handlePageBeneficiarios = async (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const mutationDeleteBeneficiario = useMutation({
    mutationFn: async ({
      beneficiarioParaDeletar,
      tokenParaDeletarBeneficiario,
    }: {
      beneficiarioParaDeletar: BeneficiarioType;
      tokenParaDeletarBeneficiario: string;
    }) => {
      return await BeneficiarioRequests.delete({
        id: beneficiarioParaDeletar.uuid,
        token: tokenParaDeletarBeneficiario,
      });
    },
    mutationKey: ["deletar-beneficiario"],
    onError: (_error, { beneficiarioParaDeletar }) => {
      toast.error(`Erro ao deletar o beneficiário ${beneficiarioParaDeletar.nome}, tente novamente!`);
    },
    onSuccess: (_data, { beneficiarioParaDeletar }) => {
      queryClient.invalidateQueries({ queryKey: ["beneficiarios"] });
      toast.success(`Beneficiário ${beneficiarioParaDeletar.nome} deletado com sucesso!`);
      handleCloseExcludeModal();
    },
  });

  const handleOpenMapModal = (beneficiario: BeneficiarioType) => {
    setBeneficiario(beneficiario);
    setOpenMapModal(true);
  };
  const handleCloseMapModal = () => setOpenMapModal(false);

  const handleOpenExcludeModal = (beneficiario: BeneficiarioType) => {
    setBeneficiario(beneficiario);
    setOpenExcludeModal(true);
  };
  const handleCloseExcludeModal = () => setOpenExcludeModal(false);

  const handleExclude = async () => {
    if (beneficiario) {
      mutationDeleteBeneficiario.mutate({
        beneficiarioParaDeletar: beneficiario,
        tokenParaDeletarBeneficiario: token!,
      });

      return;
    }

    toast.error("Ocorreu um erro inesperado ao tentar deletar o beneficiário, tente novamente!");
    handleCloseExcludeModal();
  };

  return {
    handleCloseExcludeModal,
    handleExclude,
    openExcludeModal,
    handleOpenExcludeModal,
    handleOpenMapModal,
    handleCloseMapModal,
    openMapModal,
    beneficiario,
    beneficiariosData,
    isLoadingBeneficiarios,
    isSuccessBeneficiarios,
    mutationDeleteBeneficiario,
    pagination,
    beneficiarios,
    handlePageBeneficiarios,
  };
};
