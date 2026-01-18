import { useNavigate } from "react-router";
import Button from "../../../components/button/Button";
import TabelaBeneficiarios from "../../../components/tabela-beneficiarios/TabelaBeneficiarios";
import Style from "./style.module.css";

const ListagemBeneficiariosPage = () => {
  const navigate = useNavigate();

  return (
    <div className={Style.page}>
      <main className={Style.mainContainer}>
        <section className={Style.headerBeneficiario}>
          <h2>Beneficiários</h2>
          <Button
            label="Cadastrar beneficiário"
            variant="primary"
            title="Ir para cadastro de beneficiário"
            onClick={() => navigate("/beneficiarios/cadastrar")}
          />
        </section>

        <TabelaBeneficiarios />
      </main>
    </div>
  );
};

export default ListagemBeneficiariosPage;
