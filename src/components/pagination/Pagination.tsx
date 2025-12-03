import { useMemo } from "react";
import type { PaginationType } from "../../models/global";
import "./style.css";
import Button from "../button/Button";

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

const Pagination = ({ pagination: { page, limit, totalItens }, onPageChange }: PaginationProps) => {
  const { totalPages, isShow } = useMemo(() => {
    const isShow = totalItens > limit;
    const totalPages = Math.ceil(totalItens / limit);

    return { isShow, totalPages };
  }, [totalItens, limit]);

  if (!isShow) {
    return null;
  }

  return (
    <div className="container-pagination">
      <div className="pagination">
        <Button label="Anterior" disabled={page <= 1} variant="secondary" onClick={() => onPageChange(page - 1)} />

        <div className="page-info">
          <span>
            {page} de {totalPages}
          </span>
        </div>

        <Button
          label="Próxima"
          disabled={page >= totalPages}
          variant="secondary"
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  );
};

export default Pagination;
