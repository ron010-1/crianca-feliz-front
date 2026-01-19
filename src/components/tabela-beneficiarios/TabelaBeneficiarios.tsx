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
import type { PaginationType } from "../../models/global";
import type { BeneficiarioType } from "../../models/beneficiario";
import { useMemo, useState } from "react";
import { beneficiarioConstants } from "../../constants/beneficiario.constants";

const TabelaBeneficiarios = () => {
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
  } = useTabelaBeneficiarios();

  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: beneficiarioConstants.BENEFS_PER_PAGE,
    totalItens: beneficiariosData?.count || 0,
  });

  const beneficiarios: BeneficiarioType[] = useMemo(() => {
    if (beneficiariosData) {
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;

      return beneficiariosData.rows.slice(startIndex, endIndex) as BeneficiarioType[];
    }

    return [];
  }, [pagination, beneficiariosData]);

  const handlePageBeneficiarios = async (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

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
                    <FaUserEdit className="icon-actions icon-edit" title="Editar beneficiario" />
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
          <Pagination pagination={pagination} onPageChange={handlePageBeneficiarios} />
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
