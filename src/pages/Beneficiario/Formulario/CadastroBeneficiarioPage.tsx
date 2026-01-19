import Button from "../../../components/button/Button";
import Styles from "../Listagem/style.module.css";
import StylesPage from "./styles.module.css";
import FormularioBeneficiario from "./FormularioBeneficiario";
import { useCadastroBeneficiarioPage } from "./useCadastroBeneficiarioPage";

const CadastroBeneficiarioPage = () => {
  const { onSubmit, mutationCadastrarBeneficiario, navigate } = useCadastroBeneficiarioPage();

  return (
    <div className={Styles.page}>
      <main className={Styles.mainContainer}>
        <section className={Styles.headerBeneficiario}>
          <section className={StylesPage.sectionTitleSubtitle}>
            <h2>Cadastro de Beneficiário</h2>
            <span>
              Preencha todas as informações com o beneficiário - <strong>Atenção aos campos obrigatórios com *</strong>
            </span>
          </section>
          <Button
            label="Voltar"
            variant="primary"
            title="Voltar para listagem de beneficiários"
            onClick={() => navigate("/beneficiarios")}
          />
        </section>

        <FormularioBeneficiario isEdit={false} loading={mutationCadastrarBeneficiario.isPending} onAction={onSubmit} />
      </main>
    </div>
  );
};

export default CadastroBeneficiarioPage;
