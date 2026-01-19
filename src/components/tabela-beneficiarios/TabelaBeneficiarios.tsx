import { MdDelete } from "react-icons/md";
import CustomTable from "../custom-table/CustomTable";
import { FaUserEdit } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import "./style.css";
import ConfirmModal from "../confirm-modal/ConfirmModal";
import { useTabelaBeneficiarios } from "./use-tabela-beneficiarios";
import ViewMapModal from "../view-map-modal/ViewMapModal";
import Pagination from "../pagination/Pagination";
import Loading from "../loading/Loading";
import Empty from "../empty/Empty";
import { useNavigate } from "react-router";

const TabelaBeneficiarios = () => {
  const navigate = useNavigate();
  const {
    handleCloseExcludeModal,
    handleExclude,
    openExcludeModal,
    handleOpenExcludeModal,
    handleOpenMapModal,
    handleCloseMapModal,
    openMapModal,
    beneficiario,
    beneficiariosData,
    isLoadingBeneficiarios,
    isSuccessBeneficiarios,
    mutationDeleteBeneficiario,
    pagination,
    beneficiarios,
    handlePageBeneficiarios,
  } = useTabelaBeneficiarios();

  if (isLoadingBeneficiarios) {
    return <Loading />;
  }

  if (!isSuccessBeneficiarios || !beneficiariosData) {
    return <p>Erro ao carregar beneficiários!</p>;
  }

  if (!beneficiarios.length) {
    return <Empty />;
  }

  return (
    <div>
      <div className="container-listagem">
        <CustomTable
          data={beneficiarios}
          columns={[
            { name: "Nome", accessor: (row) => row.nome },
            { name: "Responsável", accessor: (row) => row.nome_responsavel },
            { name: "Data de Nascimento", accessor: (row) => row.data_nascimento },
            { name: "Telefone 1", accessor: (row) => row.phone1 },
            { name: "Telefone 2", accessor: (row) => row.phone2 },
            {
              name: "Ações",
              accessor: (row) => {
                return (
                  <div className="actions-table">
                    <FaMapLocationDot
                      className="icon-actions icon-map"
                      role="button"
                      title="Acessar localização"
                      onClick={() => handleOpenMapModal(row)}
                    />
                    <FaUserEdit
                      className="icon-actions icon-edit"
                      title="Editar beneficiario"
                      onClick={() => navigate(`/beneficiarios/${row.uuid}/editar`)}
                    />
                    <MdDelete
                      className="icon-actions icon-delete"
                      title="Deletar beneficiario"
                      role="button"
                      onClick={() => handleOpenExcludeModal(row)}
                    />
                  </div>
                );
              },
            },
          ]}
        />

        <div className="section-pagination">
          <Pagination
            pagination={{ ...pagination, totalItens: beneficiariosData.count }}
            onPageChange={handlePageBeneficiarios}
          />
        </div>
      </div>

      <ConfirmModal
        message={
          <span>
            Deseja realmente excluir o beneficiário <strong>"{beneficiario?.nome}"</strong>?
          </span>
        }
        open={openExcludeModal}
        onClose={handleCloseExcludeModal}
        onAction={handleExclude}
        loading={mutationDeleteBeneficiario.isPending}
      />
      <ViewMapModal open={openMapModal} onClose={handleCloseMapModal} beneficiario={beneficiario!} />
    </div>
  );
};

export default TabelaBeneficiarios;
