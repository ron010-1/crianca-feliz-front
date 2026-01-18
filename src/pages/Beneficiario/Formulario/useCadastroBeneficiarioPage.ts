import { toast } from "react-toastify";
import { BeneficiarioRequests } from "../../../api/beneficiario/beneficiarioRequests";
import type { cadastrarBeneficiarioType } from "./schemaValidarForm";
import type { CreateBeneficiarioType } from "../../../models/beneficiario";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authConstants } from "../../../constants/auth.constants";
import { useNavigate } from "react-router";

export const useCadastroBeneficiarioPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tokenSalvo = localStorage.getItem(authConstants.NAME_TOKEN_IN_STORAGE);

  const mutationCadastrarBeneficiario = useMutation({
    mutationKey: ["create-beneficiario"],
    mutationFn: async (data: { beneficiarioData: CreateBeneficiarioType; token: string }) => {
      return await BeneficiarioRequests.create(data);
    },
    onSuccess() {
      toast.success("Beneficiário cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["beneficiarios"] });
      navigate("/beneficiarios");
    },

    onError: () => {
      toast.error("Ocorreu um erro ao cadastrar o beneficiário, tente novamente!");
    },
  });

  const onSubmit = (data: cadastrarBeneficiarioType) => {
    const [lat, lon] = data.location.coordinates;

    mutationCadastrarBeneficiario.mutate({
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

  return { onSubmit, mutationCadastrarBeneficiario, navigate };
};
