import { MdOutlineClose } from "react-icons/md";
import "./style.css";

interface GaleriaModalProps {
  open: boolean;
  onClose: () => void;
  fotos: string[];
  titulo: string;
}

const GaleriaModal = ({ open, onClose, fotos, titulo }: GaleriaModalProps) => {
  if (!open) return null;

  return (
    <div className="galeria-backdrop" onClick={onClose}>
      <div className="galeria-container" onClick={(e) => e.stopPropagation()}>
        <div className="galeria-header">
          <span className="galeria-title">Fotos da Visita - {titulo}</span>
          <MdOutlineClose onClick={onClose} className="galeria-close-icon" />
        </div>

        <div className="galeria-content">
          {fotos.length > 0 ? (
            fotos.map((foto, index) => (
              <div key={index} className="galeria-item">
                <img src={foto} alt={`Visita foto ${index}`} />
              </div>
            ))
          ) : (
            <p className="sem-fotos">Nenhuma foto registrada para esta visita.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GaleriaModal;
