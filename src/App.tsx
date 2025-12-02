import "./App.css";
import { ToastContainer } from "react-toastify";
import TabelaBeneficiarios from "./components/tabela-beneficiarios/TabelaBeneficiarios";
import type { BeneficiarioType } from "./models/beneficiario";
import beneficiarios from "./mocks/beneficiarios.json";
import { useMemo, useState } from "react";
import type { PaginationType } from "./models/global";

function App() {
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 5,
    totalItens: beneficiarios.length,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const beneficiariosMock: BeneficiarioType[] = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;

    return beneficiarios.slice(startIndex, endIndex) as BeneficiarioType[];
  }, [pagination]);

  const handlePageBeneficiarios = async (page: number) => {
    setLoading(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setLoading(false);
        resolve();
      }, 2000);
    });
    setPagination((prev) => ({ ...prev, page }));
  };

  return (
    <>
      <ToastContainer theme="colored" />
      <span>Hello World!</span>
      <TabelaBeneficiarios
        loading={loading}
        beneficiarios={beneficiariosMock}
        paginationDetails={{ pagination, handlePageBeneficiarios }}
      />
    </>
  );
}

export default App;
