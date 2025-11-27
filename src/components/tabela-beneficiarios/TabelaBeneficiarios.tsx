import { MdDelete } from "react-icons/md";
import CustomTable from "../custom-table/CustomTable";
import { FaUserEdit } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import "./style.css";
import ExcludeModal from "../exclude-modal/ExcludeModal";
import { useTabelaBeneficiarios } from "./use-tabela-beneficiarios";
import type { BeneficiarioType } from "../../models/beneficiario";

interface TabelaBeneficiarios {
  beneficiarios: BeneficiarioType[];
  loading: boolean;
}

const TabelaBeneficiarios = ({ beneficiarios, loading }: TabelaBeneficiarios) => {
  const { handleClose, handleExclude, open, loadingModal, handleOpen } = useTabelaBeneficiarios();

  if (loading) {
    return <span>Carregando...</span>;
  }

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
              accessor: () => {
                return (
                  <div className="actions-table">
                    <FaMapLocationDot className="icon-actions icon-map" title="Acessar localização" />
                    <FaUserEdit className="icon-actions icon-edit" title="Editar beneficiario" />
                    <MdDelete className="icon-actions icon-delete" title="Deletar beneficiario" onClick={handleOpen} />
                  </div>
                );
              },
            },
          ]}
        />
      ) : (
        <span>Nenhum beneficiario cadastrado</span>
      )}

      <ExcludeModal open={open} onClose={handleClose} onExclude={handleExclude} loading={loadingModal} />
    </>
  );
};

export default TabelaBeneficiarios;
