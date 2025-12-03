import { useMemo } from "react";
import type { PaginationType } from "../../models/global";
import "./style.css";
import Button from "../button/Button";

interface PaginationProps {
  pagination: PaginationType;
  handleItens: (page: number) => void;
}

const Pagination = ({ pagination: { page, limit, totalItens }, handleItens }: PaginationProps) => {
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
        <Button label="Anterior" disabled={page <= 1} variant="secondary" onClick={() => handleItens(page - 1)} />

        <div className="page-info">
          <span className="page-now">{page}</span>
          <span className="total">de {totalPages}</span>
        </div>

        <Button
          label="Próxima"
          disabled={page >= totalPages}
          variant="secondary"
          onClick={() => handleItens(page + 1)}
        />
      </div>
    </div>
  );
};

export default Pagination;
