import TabelaVisitas from "../../components/tabela-visitas/TabelaVisitas";
import Style from "./visita.module.css";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function VisitasPage() {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  return (
    <div className={Style.page}>
      <TabelaVisitas />
    </div>
  );
}
