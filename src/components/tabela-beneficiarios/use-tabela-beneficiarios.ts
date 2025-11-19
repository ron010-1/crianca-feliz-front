import { useState } from "react";
import { toast } from "react-toastify";

export const useTabelaBeneficiarios = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleExclude = async () => {
    setLoading(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setLoading(false);
        resolve();
      }, 2000);
    });
    handleClose();
    toast.success("Registro excluido com sucesso");
  };
  return { handleClose, handleExclude, open, loadingModal: loading, handleOpen };
};
