import { useNavigate } from "react-router";
import Button from "../../../components/button/Button";
import TabelaBeneficiarios from "../../../components/tabela-beneficiarios/TabelaBeneficiarios";
import Style from "./style.module.css";
import { useIsOnline } from "../../../hooks/useIsOnline";

const ListagemBeneficiariosPage = () => {
  const navigate = useNavigate();
  const isOnline = useIsOnline();

  return (
    <div className={Style.page}>
      <main className={Style.mainContainer}>
        <section className={Style.headerBeneficiario}>
          <h2>Beneficiários</h2>
          <Button
            label="Cadastrar beneficiário"
            variant="primary"
            title={isOnline ? "Ir para cadastro de beneficiário" : "Funcionalidade indisponível offline"}
            onClick={() => isOnline && navigate("/beneficiarios/cadastrar")}
            disabled={!isOnline}
          />
        </section>

        <TabelaBeneficiarios />
      </main>
    </div>
  );
};

export default ListagemBeneficiariosPage;