import { useState } from "react";
import type { NavButtonConfig } from "../../components/navbar/Navbar";
import { authConstants } from "../../constants/auth.constants";
import { useLocation, useNavigate } from "react-router";
import type { VariantType } from "../../models/global";

export const useLayout = () => {
  const token = localStorage.getItem(authConstants.NAME_TOKEN_IN_STORAGE);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openLogoutModal, setOpenLogoutModal] = useState<boolean>(false);

  const handleOpenLogoutModal = () => {
    setOpenLogoutModal(true);
  };

  const handleCloseLogoutModal = () => setOpenLogoutModal(false);

  const handleLogout = async () => {
    localStorage.removeItem(authConstants.NAME_TOKEN_IN_STORAGE);
    handleCloseLogoutModal();
    navigate("/login", { replace: true });
  };

  const variantForLocation = (location: string): VariantType => {
    return location === pathname ? "primary" : "secondary";
  };

  const navButtonsNotLoggedIn: NavButtonConfig[] = [
    {
      label: "Sobre",
      onClick: () =>
        window.open(
          "https://cadunicobrasil.com.br/crianca-feliz-2025-como-funciona-e-quem/",
          "_blank"
        ),
      variant: "primary",
    },
  ];

  const navButtonsLoggedIn: NavButtonConfig[] = [
    {
      label: "Inicio",
      onClick: () => navigate("/"),
      variant: variantForLocation("/"),
    },
    {
      label: "Assistente",
      onClick: () => navigate("/assistente/view"),
      variant: variantForLocation("/assistente/view"),
    },
    {
      label: "Beneficiário",
      onClick: () => navigate("/beneficiarios"),
      variant: variantForLocation("/beneficiarios"),
    },
    {
      label: "Visitas",
      onClick: () => navigate("/visitas"),
      variant: variantForLocation("/visitas"),
    },
    {
      label: "Sair",
      onClick: handleOpenLogoutModal,
      variant: "danger",
    },
  ];

  return {
    navButtonsLoggedIn,
    navButtonsNotLoggedIn,
    handleCloseLogoutModal,
    handleLogout,
    openLogoutModal,
    token,
  };
};