import TabelaVisitas from "../../components/tabela-visitas/TabelaVisitas";
import Style from "./visita.module.css";

export default function VisitasPage() {
  return (
    <div className={Style.page}>
      <TabelaVisitas />
    </div>
  );
}
