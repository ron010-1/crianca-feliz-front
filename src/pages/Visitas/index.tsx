import { useState, useMemo } from "react";
import { FaUserEdit, FaSearch, FaPlus } from "react-icons/fa";
import { MdDelete, MdEventAvailable, MdEventNote, MdEventBusy } from "react-icons/md";

import Input from "../../components/Input/Input";
import Button from "../../components/button/Button";
import CustomTable from "../../components/custom-table/CustomTable";
import VisitaModal from "../../components/visita-modal/VisitaModal";
import ExcludeModal from "../../components/exclude-modal/ExcludeModal";

import "./style.css";

import beneficiariosMock from "../../mocks/beneficiarios.json";
import type { VisitaType } from "../../models/visita";

const initialVisitas: VisitaType[] = [
  { id: 1, data: "2023-10-25", beneficiarioId: 1, beneficiarioNome: "Ana Clara Ferreira", status: "Realizada", observacao: "Evolução positiva." },
  { id: 2, data: "2023-10-26", beneficiarioId: 2, beneficiarioNome: "Carlos Eduardo", status: "Agendada", observacao: "" },
];

export default function VisitasPage() {
  const [visitas, setVisitas] = useState<VisitaType[]>(initialVisitas);
  const [busca, setBusca] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [visitaSelecionada, setVisitaSelecionada] = useState<VisitaType | null>(null);

  const visitasFiltradas = useMemo(() => {
    return visitas.filter(v => {
      // Filtra pelo nome
      const matchesName = v.beneficiarioNome.toLowerCase().includes(busca.toLowerCase());
      
      // Filtra pelo status (se tiver algum selecionado)
      const matchesStatus = statusFilter ? v.status === statusFilter : true;

      return matchesName && matchesStatus;
    });
  }, [visitas, busca, statusFilter]);

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

  const confirmarDelecao = () => {
    if (visitaSelecionada) {
      setVisitas(prev => prev.filter(v => v.id !== visitaSelecionada.id));
      setModalDeleteOpen(false);
      setVisitaSelecionada(null);
    }
  };

  const salvarVisita = (dados: Partial<VisitaType>) => {
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
  };

  const renderStatus = (status: string) => {
    let Icon = MdEventNote;
    if (status === "Realizada") Icon = MdEventAvailable;
    if (status === "Cancelada") Icon = MdEventBusy;

    return (
      <span className={`status-badge status-${status}`}>
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
        <div className="actions-table">
          <FaUserEdit 
            className="icon-action icon-edit" 
            title="Editar" 
            onClick={() => handleEditar(row)} 
          />
          <MdDelete 
            className="icon-action icon-delete" 
            title="Excluir" 
            onClick={() => handleDeletarClick(row)} 
          />
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Visitas</h1>
          <p className="page-subtitle">Gerencie o agendamento e histórico de visitas.</p>
        </div>
        <Button label="Nova Visita" onClick={handleNovo} />
      </div>

      <div className="filters-container">
        <div className="search-wrapper">
          <Input 
            placeholder="Buscar por beneficiário..." 
            value={busca} 
            onChange={setBusca}
          />
        </div>

        <select 
          className="status-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="Agendada">Agendada</option>
          <option value="Realizada">Realizada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>

      <CustomTable columns={columns} data={visitasFiltradas} />

      <VisitaModal 
        open={modalFormOpen}
        onClose={() => setModalFormOpen(false)}
        onSave={salvarVisita}
        beneficiarios={beneficiariosMock}
        visitaEdicao={visitaSelecionada}
      />

      <ExcludeModal
        open={modalDeleteOpen}
        onClose={() => setModalDeleteOpen(false)}
        onExclude={confirmarDelecao}
        message={`Tem certeza que deseja remover a visita de ${visitaSelecionada?.beneficiarioNome}?`}
      />
    </div>
  );
}