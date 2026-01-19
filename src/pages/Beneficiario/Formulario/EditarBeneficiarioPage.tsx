import Button from "../../../components/button/Button";
import Styles from "../Listagem/style.module.css";
import StylesPage from "./styles.module.css";
import FormularioBeneficiario from "./FormularioBeneficiario";
import Loading from "../../../components/loading/Loading";
import { useEditBeneficiarioPage } from "./useEditBeneficiarioPage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const EditarBeneficiarioPage = () => {
  const navigate = useNavigate();
  const result = useEditBeneficiarioPage();

  if (!result) {
    toast.error("Identificador do beneficiário não encontrado");
    navigate("/beneficiarios");
    return null;
  }

  const { onSubmit, mutationEditarBeneficiario, beneficiarioData, isLoadingBeneficiario, isSuccessBeneficiario } =
    result;

  return (
    <div className={Styles.page}>
      <main className={Styles.mainContainer}>
        <section className={Styles.headerBeneficiario}>
          <section className={StylesPage.sectionTitleSubtitle}>
            <h2>Edição de Beneficiário</h2>
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

        {isLoadingBeneficiario ? (
          <Loading />
        ) : isSuccessBeneficiario && beneficiarioData ? (
          <FormularioBeneficiario
            isEdit={true}
            beneficiario={beneficiarioData}
            loading={mutationEditarBeneficiario.isPending}
            onAction={onSubmit}
          />
        ) : (
          <p>Erro</p>
        )}
      </main>
    </div>
  );
};

export default EditarBeneficiarioPage;
