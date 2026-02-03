import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import TabelaBeneficiarios from "../custom-table/CustomTable";
import "./style.css";
import ExcludeModal from "../confirm-modal/ConfirmModal";
import Pagination from "../pagination/Pagination";
import Loading from "../loading/Loading";
import Empty from "../empty/Empty";
import type { PaginationType } from "../../models/global";
import { useIsOnline } from "../../hooks/useIsOnline";

export interface AssistenteType {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

interface TabelaAssistentesProps {
  assistentes: AssistenteType[];
  loading?: boolean;
  paginationDetails?: {
    pagination: PaginationType;
    onPageChange: (page: number) => void;
  };
  onEdit: (assistente: AssistenteType) => void;
  onDelete: (id: string) => Promise<void> | void;
}

const TabelaAssistentes = ({
  assistentes,
  paginationDetails,
  loading = false,
  onEdit,
  onDelete,
}: TabelaAssistentesProps) => {
  const isOnline = useIsOnline();
  const [assistenteParaExcluir, setAssistenteParaExcluir] = useState<AssistenteType | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);

  const handleOpenExcludeModal = (assistente: AssistenteType) => {
    if (!isOnline) return;
    setAssistenteParaExcluir(assistente);
  };

  const handleCloseExcludeModal = () => {
    setAssistenteParaExcluir(null);
  };

  const handleConfirmExclude = async () => {
    if (!assistenteParaExcluir) return;

    setLoadingModal(true);
    try {
      await onDelete(assistenteParaExcluir.id);
      handleCloseExcludeModal();
    } catch (error) {
      console.error("Erro ao excluir", error);
    } finally {
      setLoadingModal(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="wrapper-tabela">
      {/* Banner de aviso quando offline */}
      {!isOnline && (
        <div className="offline-banner">
          <span>Você está offline. As ações de edição e exclusão foram desativadas.</span>
        </div>
      )}

      {assistentes.length ? (
        <div className={`container-listagem ${!isOnline ? "is-offline" : ""}`}>
          <TabelaBeneficiarios
            data={assistentes}
            columns={[
              { name: "Nome", accessor: (row) => row.nome },
              { name: "Email", accessor: (row) => row.email },
              { name: "Telefone", accessor: (row) => row.telefone },
              {
                name: "Ações",
                accessor: (row) => {
                  return (
                    <div className={`actions-table ${!isOnline ? "disabled-actions" : ""}`}>
                      <FaUserEdit
                        className="icon-actions icon-edit"
                        title={isOnline ? "Editar assistente" : "Indisponível (Offline)"}
                        role="button"
                        onClick={() => isOnline && onEdit(row)}
                      />

                      <MdDelete
                        className="icon-actions icon-delete"
                        title={isOnline ? "Deletar assistente" : "Indisponível (Offline)"}
                        role="button"
                        onClick={() => isOnline && handleOpenExcludeModal(row)}
                      />
                    </div>
                  );
                },
              },
            ]}
          />

          {paginationDetails && (
            <div className="section-pagination">
              <Pagination 
                pagination={paginationDetails.pagination} 
                onPageChange={paginationDetails.onPageChange} 
              />
            </div>
          )}
        </div>
      ) : (
        <Empty />
      )}

      <ExcludeModal
        open={!!assistenteParaExcluir}
        onClose={handleCloseExcludeModal}
        onAction={handleConfirmExclude}
        loading={loadingModal}
        message={
          assistenteParaExcluir ? (
            <span>
              Tem certeza que deseja excluir o assistente <strong>"{assistenteParaExcluir.nome}"</strong>?
            </span>
          ) : undefined
        }
        type="danger"
      />
    </div>
  );
};

export default TabelaAssistentes;