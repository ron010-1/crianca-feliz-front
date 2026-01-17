import Button from "../../../components/button/Button";
import TabelaBeneficiarios from "../../../components/tabela-beneficiarios/TabelaBeneficiarios";
import Style from "./style.module.css";

const ListagemBeneficiariosPage = () => {
  return (
    <div className={Style.page}>
      <main className={Style.mainContainer}>
        <section className={Style.headerBeneficiario}>
          <h2>Beneficiários</h2>
          <Button label="Cadastrar beneficiário" variant="primary" title="Ir para cadastro de beneficiário" />
        </section>

        <TabelaBeneficiarios />
      </main>
    </div>
  );
};

export default ListagemBeneficiariosPage;
