import { MdDelete } from "react-icons/md";
import CustomTable from "../custom-table/CustomTable";
import { FaUserEdit } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import "./style.css";
import ExcludeModal from "../exclude-modal/ExcludeModal";
import { useTabelaBeneficiarios } from "./use-tabela-beneficiarios";
import type { BeneficiarioType } from "../../models/beneficiario";
import ViewMapModal from "../view-map-modal/ViewMapModal";

interface TabelaBeneficiarios {
  beneficiarios: BeneficiarioType[];
}

const TabelaBeneficiarios = ({ beneficiarios }: TabelaBeneficiarios) => {
  const {
    handleCloseExcludeModal,
    handleExclude,
    openExcludeModal,
    loadingModal,
    handleOpenExcludeModal,
    handleOpenMapModal,
    handleCloseMapModal,
    openMapModal,
    beneficiario,
  } = useTabelaBeneficiarios();

  return (
    <>
      {beneficiarios.length ? (
        <CustomTable
          data={beneficiarios}
          columns={[
            { name: "ID", accessor: (row) => row.id },
            { name: "Nome", accessor: (row) => row.name },
            { name: "Responsável", accessor: (row) => row.responsavel },
            { name: "Data de Nascimento", accessor: (row) => row.dataNascimento },
            { name: "Telefone 1", accessor: (row) => row.telefone1 },
            { name: "Telefone 2", accessor: (row) => row.telefone2 },
            {
              name: "Ações",
              accessor: (row) => {
                return (
                  <div className="actions-table">
                    <FaMapLocationDot
                      className="icon-actions icon-map"
                      title="Acessar localização"
                      onClick={() => handleOpenMapModal(row)}
                    />
                    <FaUserEdit className="icon-actions icon-edit" title="Editar beneficiario" />
                    <MdDelete
                      className="icon-actions icon-delete"
                      title="Deletar beneficiario"
                      onClick={handleOpenExcludeModal}
                    />
                  </div>
                );
              },
            },
          ]}
        />
      ) : (
        <span>Nenhum beneficiario cadastrado</span>
      )}

      <ExcludeModal
        open={openExcludeModal}
        onClose={handleCloseExcludeModal}
        onExclude={handleExclude}
        loading={loadingModal}
      />
      <ViewMapModal open={openMapModal} onClose={handleCloseMapModal} beneficiario={beneficiario!} />
    </>
  );
};

export default TabelaBeneficiarios;
