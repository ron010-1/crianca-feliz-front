import { useState, useEffect, useRef } from "react";
import { MdOutlineClose, MdCloudUpload, MdDelete, MdSearch } from "react-icons/md";
import Input from "../Input/Input";
import Button from "../button/Button";
import Loading from "../loading/Loading"; 
import "./style.css";
import type { VisitaType, StatusVisita } from "../../models/visita";
import type { BeneficiarioType } from "../../models/beneficiario";

interface VisitaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (visita: Partial<VisitaType>) => void;
  beneficiarios: BeneficiarioType[];
  visitaEdicao?: VisitaType | null;
  loading?: boolean;
}

const VisitaModal = ({ open, onClose, onSave, beneficiarios, visitaEdicao, loading = false }: VisitaModalProps) => {
  const [formData, setFormData] = useState<Partial<VisitaType>>({
    status: "Agendada",
    data: "",
    observacao: "",
    beneficiarioId: "",
    fotos: []
  });

  const [previewFotos, setPreviewFotos] = useState<string[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredBeneficiarios, setFilteredBeneficiarios] = useState<BeneficiarioType[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      if (visitaEdicao) {
        setFormData(visitaEdicao);
        setPreviewFotos(visitaEdicao.fotos || []);
        setSearchTerm(visitaEdicao.beneficiarioNome || "");
      } else {
        setFormData({
          status: "Agendada",
          data: "",
          observacao: "",
          beneficiarioId: "",
          fotos: []
        });
        setPreviewFotos([]);
        setSearchTerm("");
      }
      setIsSearching(false);
    }
  }, [open, visitaEdicao]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = beneficiarios.filter(b => 
        b.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBeneficiarios(filtered);
    } else {
      setFilteredBeneficiarios(beneficiarios);
    }
  }, [searchTerm, beneficiarios]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setPreviewFotos(prev => [...prev, ...newPreviews]);
      setFormData(prev => ({
        ...prev,
        fotos: [...(prev.fotos || []), ...newPreviews]
      }));
    }
  };

  const removeFoto = (index: number) => {
    const novasFotos = previewFotos.filter((_, i) => i !== index);
    setPreviewFotos(novasFotos);
    setFormData(prev => ({ ...prev, fotos: novasFotos }));
  };

  const handleSelectBeneficiario = (beneficiario: BeneficiarioType) => {
    setFormData({ ...formData, beneficiarioId: beneficiario.uuid });
    setSearchTerm(beneficiario.nome);
    setIsSearching(false);
  };

  if (!open) return null;

  const handleSubmit = () => {
    if (!formData.beneficiarioId || !formData.data) {
      alert("Por favor, selecione um beneficiário e preencha a data.");
      return;
    }
    
    const beneficiarioSelecionado = beneficiarios.find(b => b.uuid === formData.beneficiarioId);
    
    onSave({
      ...formData,
      beneficiarioNome: beneficiarioSelecionado?.nome || searchTerm || "Desconhecido"
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
          <div className="form-group" ref={searchContainerRef}>
            <label className="form-label">Beneficiário</label>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="form-input-search"
                placeholder="Pesquisar beneficiário..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearching(true);
                  if (e.target.value === "") {
                    setFormData({ ...formData, beneficiarioId: "" });
                  }
                }}
                onFocus={() => setIsSearching(true)}
              />
              <MdSearch className="search-icon" />
            </div>
            
            {isSearching && (
              <div className="search-results-dropdown">
                {filteredBeneficiarios.length > 0 ? (
                  filteredBeneficiarios.map(b => (
                    <div 
                      key={b.uuid} 
                      className={`search-result-item ${formData.beneficiarioId === b.uuid ? 'selected' : ''}`}
                      onClick={() => handleSelectBeneficiario(b)}
                    >
                      {b.nome}
                    </div>
                  ))
                ) : (
                  <div className="search-result-empty">Nenhum beneficiário encontrado</div>
                )}
              </div>
            )}
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
            <label className="form-label">Fotos da Visita</label>
            <div className="upload-area">
              <input 
                type="file" 
                id="file-upload" 
                multiple 
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                className="hidden-input"
              />
              <label htmlFor="file-upload" className="upload-label">
                <MdCloudUpload size={24} />
                <span>Clique para adicionar fotos</span>
              </label>
            </div>

            {previewFotos.length > 0 && (
              <div className="preview-container">
                {previewFotos.map((foto, index) => (
                  <div key={index} className="preview-item">
                    <img src={foto} alt={`Preview ${index}`} />
                    <button 
                      type="button" 
                      className="remove-btn"
                      onClick={() => removeFoto(index)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
          <Button 
            label={loading ? <Loading size="sm" withMessage={false} /> : "Salvar"} 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default VisitaModal;