import { useState } from "react";
import { toast } from "react-toastify";
import type { BeneficiarioType } from "../../models/beneficiario";

export const useTabelaBeneficiarios = () => {
  const [openExcludeModal, setOpenExcludeModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openMapModal, setOpenMapModal] = useState<boolean>(false);
  const [beneficiario, setBeneficiario] = useState<BeneficiarioType | null>(null);

  const handleOpenMapModal = (beneficiario: BeneficiarioType) => {
    setBeneficiario(beneficiario);
    setOpenMapModal(true);
  };
  const handleCloseMapModal = () => setOpenMapModal(false);

  const handleOpenExcludeModal = () => setOpenExcludeModal(true);
  const handleCloseExcludeModal = () => setOpenExcludeModal(false);

  const handleExclude = async () => {
    setLoading(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setLoading(false);
        resolve();
      }, 2000);
    });
    handleCloseExcludeModal();
    toast.success("Registro excluido com sucesso");
  };
  return {
    handleCloseExcludeModal,
    handleExclude,
    openExcludeModal,
    loadingModal: loading,
    handleOpenExcludeModal,
    handleOpenMapModal,
    handleCloseMapModal,
    openMapModal,
    beneficiario,
  };
};
