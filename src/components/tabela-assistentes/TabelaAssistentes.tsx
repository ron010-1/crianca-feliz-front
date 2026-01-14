import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import TabelaBeneficiarios from "../custom-table/CustomTable"; 
import "./style.css"; 
import ExcludeModal from "../exclude-modal/ExcludeModal"; 
import Pagination from "../pagination/Pagination"; 
import Loading from "../loading/Loading";
import Empty from "../empty/Empty";
import type { PaginationType } from "../../models/global"; 

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
  onDelete 
}: TabelaAssistentesProps) => {

  const [assistenteParaExcluir, setAssistenteParaExcluir] = useState<AssistenteType | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);

  const handleOpenExcludeModal = (assistente: AssistenteType) => {
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
    <div>
      {assistentes.length ? (
        <div className="container-listagem">
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
                    <div className="actions-table">
                      <FaUserEdit 
                        className="icon-actions icon-edit" 
                        title="Editar assistente" 
                        role="button"
                        onClick={() => onEdit(row)}
                      />
                      
                      <MdDelete
                        className="icon-actions icon-delete"
                        title="Deletar assistente"
                        role="button"
                        onClick={() => handleOpenExcludeModal(row)}
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
        onExclude={handleConfirmExclude}
        loading={loadingModal}
        message={
            assistenteParaExcluir 
            ? `Tem certeza que deseja excluir o assistente ${assistenteParaExcluir.nome}?` 
            : undefined
        }
      />
    </div>
  );
};

export default TabelaAssistentes;