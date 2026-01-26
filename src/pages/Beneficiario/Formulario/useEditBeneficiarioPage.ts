import { toast } from "react-toastify";
import type { cadastrarBeneficiarioType } from "./schemaValidarForm";
import { BeneficiarioRequests } from "../../../api/beneficiario/beneficiarioRequests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import type { CreateBeneficiarioType } from "../../../models/beneficiario";
import { useAppSelector } from "../../../hooks/useAppSelector";

export const useEditBeneficiarioPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const tokenSalvo = useAppSelector((state) => state.auth.token);;

  const {
    data: beneficiarioData,
    isLoading: isLoadingBeneficiario,
    isSuccess: isSuccessBeneficiario,
  } = useQuery({
    queryKey: [id],
    queryFn: async () => {
      if (id) return await BeneficiarioRequests.getById({ token: tokenSalvo!, id });
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const mutationEditarBeneficiario = useMutation({
    mutationKey: ["edit-beneficiario"],
    mutationFn: async (data: { id: string; beneficiarioData: Partial<CreateBeneficiarioType>; token: string }) => {
      return await BeneficiarioRequests.edit(data);
    },
    onSuccess() {
      toast.success("Beneficiário editado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["beneficiarios"] });
      navigate("/beneficiarios");
    },

    onError: () => {
      toast.error("Ocorreu um erro ao editar o beneficiário, tente novamente!");
    },
  });

  if (!id) {
    return null;
  }

  const onSubmit = (data: cadastrarBeneficiarioType) => {
    const [lat, lon] = data.location.coordinates;

    mutationEditarBeneficiario.mutate({
      id,
      beneficiarioData: {
        ...data,
        phone2: data.phone2 || null,
        location: {
          ...data.location,
          coordinates: [lon, lat],
        },
      },
      token: tokenSalvo!,
    });
  };

  return {
    onSubmit,
    mutationEditarBeneficiario,
    beneficiarioData,
    isLoadingBeneficiario,
    isSuccessBeneficiario,
  };
};
