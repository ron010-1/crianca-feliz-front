import "./style.css";
import { MdOutlineClose } from "react-icons/md";

interface ExcludeModalProps {
  open: boolean;
  onClose: () => void;
  mensagem?: string;
  onExclude: () => void;
}

const ExcludeModal = ({ open, onClose, mensagem, onExclude }: ExcludeModalProps) => {
  if (!open) return null;

  return (
    <div className="backdrop">
      <div className="modal">
        <div className="header-modal">
          <span className="title-modal">Confirme exclusão</span>
          <MdOutlineClose onClick={onClose} className="icon-close" title="Fechar" />
        </div>

        <div className="content-modal">
          <p className="message-modal">
            {mensagem || "Confirme no botão abaixo que você deseja excluir este registro"}
          </p>
        </div>

        <div className="actions-modal">
          <button className="btn-base btn-exclude" onClick={onExclude}>
            Excluir
          </button>
          <button className="btn-base btn-cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcludeModal;
