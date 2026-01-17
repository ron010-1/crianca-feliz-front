import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar, { type NavButtonConfig } from "../components/navbar/Navbar";
import type { VariantType } from "../models/global";

const Layout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const variantForLocation = (location: string): VariantType => {
    return location === pathname ? "primary" : "secondary";
  };

  const navButtonsNotLoggedIn: NavButtonConfig[] = [
    {
      label: "Sobre",
      onClick: () => window.open("https://cadunicobrasil.com.br/crianca-feliz-2025-como-funciona-e-quem/", "_blank"),
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
      onClick: () => navigate("/assistente"),
      variant: variantForLocation("/assistente"),
    },
    {
      label: "Beneficiário",
      onClick: () => navigate("/beneficiarios"),
      variant: variantForLocation("/beneficiarios"),
    },
    {
      label: "Sair",
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      },
      variant: "danger",
    },
  ];

  return (
    <>
      <Navbar logoUrl="/logo.png" brandName="SIGPCF" buttons={token ? navButtonsLoggedIn : navButtonsNotLoggedIn} />
      <Outlet />
    </>
  );
};

export default Layout;
