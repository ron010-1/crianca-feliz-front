import React from "react";
import { FaCamera, FaUserEdit } from "react-icons/fa";
import { MdDelete, MdSearch } from "react-icons/md";

import Style from "./style.module.css";

import Input from "../Input/Input";
import Button from "../button/Button";
import CustomTable from "../custom-table/CustomTable";
import Loading from "../loading/Loading";
import Pagination from "../pagination/Pagination";
import Empty from "../empty/Empty";

import type { VisitaType } from "../../models/visita";
import type { PaginationType } from "../../models/global";

type PaginationDetails = {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
};

type Props = {
  loading: boolean;
  online: boolean;

  visitas: VisitaType[];

  paginationDetails?: PaginationDetails;

  busca: string;
  onBuscaChange: (value: string) => void;

  onNovo: () => void;
  onVerFotos: (visita: VisitaType) => void;
  onEditar: (visita: VisitaType) => void;
  onDeletar: (visita: VisitaType) => void;
};

const formatDateForDisplay = (value?: string) => {
  if (!value) return "-";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  const d = String(dt.getDate()).padStart(2, "0");
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const y = dt.getFullYear();
  return `${d}/${m}/${y}`;
};

const TabelaVisitasView = ({
  loading,
  online,
  visitas,
  paginationDetails,
  busca,
  onBuscaChange,
  onNovo,
  onVerFotos,
  onEditar,
  onDeletar,
}: Props) => {
  const columns = React.useMemo(
    () => [
      {
        name: "Data",
        accessor: (row: VisitaType) => formatDateForDisplay(row.data),
      },
      {
        name: "Beneficiário",
        accessor: (row: VisitaType) => row.beneficiarioNome || "-",
      },
      {
        name: "Evolução",
        accessor: (row: VisitaType) => row.evolucao,
      },
      {
        name: "Acompanhamento",
        accessor: (row: VisitaType) => row.acompanhamento_familiar,
      },
      {
        name: "Estímulo",
        accessor: (row: VisitaType) => row.estimulo_familiar,
      },
      {
        name: "Ações",
        accessor: (row: VisitaType) => (
          <div className={`${Style.actionsTable} ${!online ? Style.disabledActions : ""}`}>
            <FaCamera
              className={`${Style.iconActions} ${Style.iconCamera}`}
              role="button"
              title={online ? "Ver fotos" : "Offline"}
              onClick={() => online && onVerFotos(row)}
            />
            <FaUserEdit
              className={`${Style.iconActions} ${Style.iconEdit}`}
              title={online ? "Editar visita" : "Offline"}
              role="button"
              onClick={() => online && onEditar(row)}
            />
            <MdDelete
              className={`${Style.iconActions} ${Style.iconDelete}`}
              title={online ? "Deletar visita" : "Offline"}
              role="button"
              onClick={() => online && onDeletar(row)}
            />
          </div>
        ),
      },
    ],
    [online, onVerFotos, onEditar, onDeletar]
  );

  if (loading) return <Loading />;

  return (
    <div className={Style.containerListagem}>
      <section className={Style.headerVisitas}>
        <h2>Visitas</h2>
        <Button
          label="Nova Visita"
          variant="primary"
          onClick={onNovo}
          disabled={!online}
          title={!online ? "Funcionalidade indisponível offline" : ""}
        />
      </section>

      <div className={Style.filtersContainer}>
        <div className={Style.searchWrapper}>
          <Input
            placeholder="Buscar por beneficiário..."
            value={busca}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onBuscaChange(e.target.value)}
          />
          <MdSearch className={Style.searchIcon} />
        </div>
      </div>

      {visitas.length === 0 ? (
        <Empty />
      ) : (
        <>
          <CustomTable data={visitas} columns={columns} />
          {paginationDetails && (
            <div className={Style.sectionPagination}>
              <Pagination pagination={paginationDetails.pagination} onPageChange={paginationDetails.onPageChange} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TabelaVisitasView;
