import { useState, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import Input from "../Input/Input";
import Button from "../button/Button";
import "./style.css";
import type { VisitaType, StatusVisita } from "../../models/visita";
import type { BeneficiarioType } from "../../models/beneficiario";

interface VisitaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (visita: Partial<VisitaType>) => void;
  beneficiarios: BeneficiarioType[];
  visitaEdicao?: VisitaType | null;
}

const VisitaModal = ({ open, onClose, onSave, beneficiarios, visitaEdicao }: VisitaModalProps) => {
  const [formData, setFormData] = useState<Partial<VisitaType>>({
    status: "Agendada",
    data: "",
    observacao: "",
    beneficiarioId: 0
  });

  useEffect(() => {
    if (open) {
      if (visitaEdicao) {
        setFormData(visitaEdicao);
      } else {
        setFormData({
          status: "Agendada",
          data: "",
          observacao: "",
          beneficiarioId: 0
        });
      }
    }
  }, [open, visitaEdicao]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!formData.beneficiarioId || !formData.data) {
      alert("Por favor, preencha o beneficiário e a data.");
      return;
    }
    
    const beneficiarioSelecionado = beneficiarios.find(b => Number(b.id) === Number(formData.beneficiarioId));
    
    onSave({
      ...formData,
      beneficiarioNome: beneficiarioSelecionado?.name || "Desconhecido"
    });
  };

  return (
    <div className="backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">
            {visitaEdicao ? "Editar Visita" : "Agendar Nova Visita"}
          </h3>
          <MdOutlineClose onClick={onClose} className="close-icon" title="Fechar" />
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Beneficiário</label>
            <select 
              className="form-select"
              value={formData.beneficiarioId}
              onChange={(e) => setFormData({...formData, beneficiarioId: Number(e.target.value)})}
              disabled={!!visitaEdicao}
            >
              <option value={0}>Selecione um beneficiário...</option>
              {beneficiarios.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Data</label>
              <Input 
                type="date" 
                value={formData.data || ""} 
                onChange={(v) => setFormData({...formData, data: v})} 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as StatusVisita})}
              >
                <option value="Agendada">Agendada</option>
                <option value="Realizada">Realizada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Observações</label>
            <textarea 
              className="form-textarea"
              rows={3}
              placeholder="Detalhes sobre a visita..."
              value={formData.observacao || ""}
              onChange={(e) => setFormData({...formData, observacao: e.target.value})}
            />
          </div>
        </div>

        <div className="modal-footer">
          <Button label="Cancelar" variant="secondary" onClick={onClose} />
          <Button label="Salvar" variant="primary" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default VisitaModal;