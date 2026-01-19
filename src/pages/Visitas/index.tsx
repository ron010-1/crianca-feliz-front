import { useState, useMemo, useEffect } from "react";
import { FaUserEdit, FaCamera } from "react-icons/fa";
import { MdDelete, MdEventAvailable, MdEventNote, MdEventBusy } from "react-icons/md";

import Input from "../../components/Input/Input";
import Button from "../../components/button/Button";
import CustomTable from "../../components/custom-table/CustomTable";
import VisitaModal from "../../components/visita-modal/VisitaModal";
import ConfirmModal from "../../components/confirm-modal/ConfirmModal";
import GaleriaModal from "../../components/galeria-modal/GaleriaModal";
import Loading from "../../components/loading/Loading";
import Pagination from "../../components/pagination/Pagination";

import Style from "./visita.module.css";

import beneficiariosMock from "../../mocks/beneficiarios.json";
import type { VisitaType } from "../../models/visita";
import type { BeneficiarioType } from "../../models/beneficiario";
import type { PaginationType } from "../../models/global";

const initialVisitas: VisitaType[] = (beneficiariosMock as any[]).map((beneficiario, index) => ({
  id: index + 1,
  data: "2023-10-25",
  beneficiarioId: beneficiario.uuid || String(beneficiario.id),
  beneficiarioNome: beneficiario.nome || beneficiario.name,
  status: index % 3 === 0 ? "Realizada" : index % 3 === 1 ? "Agendada" : "Cancelada",
  observacao: "Visita de acompanhamento gerada automaticamente.",
  fotos: []
}));

export default function VisitasPage() {
  const [visitas, setVisitas] = useState<VisitaType[]>(initialVisitas);
  const [loading, setLoading] = useState(true);

  const [busca, setBusca] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 5,
    totalItens: 0
  });

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalGaleriaOpen, setModalGaleriaOpen] = useState(false);
  
  const [visitaSelecionada, setVisitaSelecionada] = useState<VisitaType | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const visitasFiltradasTotal = useMemo(() => {
    return visitas.filter(v => {
      const matchesName = v.beneficiarioNome.toLowerCase().includes(busca.toLowerCase());
      const matchesStatus = statusFilter ? v.status === statusFilter : true;
      return matchesName && matchesStatus;
    });
  }, [visitas, busca, statusFilter]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, totalItens: visitasFiltradasTotal.length, page: 1 }));
  }, [visitasFiltradasTotal.length]);

  const visitasPaginadas = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return visitasFiltradasTotal.slice(startIndex, endIndex);
  }, [visitasFiltradasTotal, pagination.page, pagination.limit]);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setPagination(prev => ({ ...prev, page: newPage }));
    setLoading(false);
  };

  const handleNovo = () => {
    setVisitaSelecionada(null); 
    setModalFormOpen(true);
  };

  const handleEditar = (visita: VisitaType) => {
    setVisitaSelecionada(visita);
    setModalFormOpen(true);
  };

  const handleDeletarClick = (visita: VisitaType) => {
    setVisitaSelecionada(visita);
    setModalDeleteOpen(true);
  };

  const handleVerFotos = (visita: VisitaType) => {
    setVisitaSelecionada(visita);
    setModalGaleriaOpen(true);
  };

  const confirmarDelecao = () => {
    if (visitaSelecionada) {
      setLoading(true);
      setTimeout(() => {
        setVisitas(prev => prev.filter(v => v.id !== visitaSelecionada.id));
        setModalDeleteOpen(false);
        setVisitaSelecionada(null);
        setLoading(false);
      }, 1000);
    }
  };

  const salvarVisita = (dados: Partial<VisitaType>) => {
    setLoading(true);
    setTimeout(() => {
      if (visitaSelecionada) {
        setVisitas(prev => prev.map(v => v.id === visitaSelecionada.id ? { ...v, ...dados } as VisitaType : v));
      } else {
        const novaVisita: VisitaType = {
          ...(dados as VisitaType),
          id: Math.random()
        };
        setVisitas([...visitas, novaVisita]);
      }
      setModalFormOpen(false);
      setLoading(false);
    }, 1000);
  };

  const renderStatus = (status: string) => {
    let Icon = MdEventNote;
    if (status === "Realizada") Icon = MdEventAvailable;
    if (status === "Cancelada") Icon = MdEventBusy;
    
    const statusClass = `status${status}`;

    return (
      <span className={`${Style.statusBadge} ${Style[statusClass]}`}>
        <Icon /> {status}
      </span>
    );
  };

  const columns = [
    { 
      name: "Data", 
      accessor: (row: VisitaType) => new Date(row.data).toLocaleDateString("pt-BR", {timeZone: 'UTC'}) 
    },
    { 
      name: "Beneficiário", 
      accessor: (row: VisitaType) => row.beneficiarioNome 
    },
    { 
      name: "Status", 
      accessor: (row: VisitaType) => renderStatus(row.status) 
    },
    { 
      name: "Observação", 
      accessor: (row: VisitaType) => row.observacao || "-" 
    },
    {
      name: "Ações",
      accessor: (row: VisitaType) => (
        <div className={Style.actionsTable}>
          {row.status === "Realizada" && (
            <FaCamera 
              className={`${Style.iconActions} ${Style.iconCamera}`}
              title="Ver Fotos"
              role="button"
              onClick={() => handleVerFotos(row)}
            />
          )}

          <FaUserEdit 
            className={`${Style.iconActions} ${Style.iconEdit}`}
            title="Editar visita" 
            role="button"
            onClick={() => handleEditar(row)} 
          />
          <MdDelete 
            className={`${Style.iconActions} ${Style.iconDelete}`}
            title="Excluir visita" 
            role="button"
            onClick={() => handleDeletarClick(row)} 
          />
        </div>
      ),
    },
  ];

  return (
    <div className={Style.page}>
      <main className={Style.mainContainer}>
        
        <section className={Style.headerVisitas}>
          <h2>Visitas</h2>
          <Button 
            label="Nova Visita" 
            variant="primary" 
            onClick={handleNovo} 
            title="Agendar nova visita"
          />
        </section>

        <div className={Style.filtersContainer}>
          <div className={Style.searchWrapper}>
            <Input 
              placeholder="Buscar por beneficiário..." 
              value={busca} 
              onChange={setBusca}
            />
          </div>

          <select 
            className={Style.statusSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="Agendada">Agendada</option>
            <option value="Realizada">Realizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loading message="Carregando visitas..." size="lg" />
          </div>
        ) : (
          <>
            <CustomTable columns={columns} data={visitasPaginadas} />
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <Pagination 
                pagination={pagination} 
                onPageChange={handlePageChange} 
              />
            </div>
          </>
        )}

        <VisitaModal 
          open={modalFormOpen}
          onClose={() => setModalFormOpen(false)}
          onSave={salvarVisita}
          beneficiarios={beneficiariosMock as unknown as BeneficiarioType[]}
          visitaEdicao={visitaSelecionada}
          loading={loading && modalFormOpen} 
        />

        <ConfirmModal
          open={modalDeleteOpen}
          onClose={() => setModalDeleteOpen(false)}
          onAction={confirmarDelecao}
          message={<span>Tem certeza que deseja remover a visita de <strong>{visitaSelecionada?.beneficiarioNome}</strong>?</span>}
          type="danger"
          loading={loading && modalDeleteOpen}
        />
        
        <GaleriaModal
          open={modalGaleriaOpen}
          onClose={() => setModalGaleriaOpen(false)}
          fotos={visitaSelecionada?.fotos || []}
          titulo={visitaSelecionada?.beneficiarioNome || ""}
        />
      </main>
    </div>
  );
}