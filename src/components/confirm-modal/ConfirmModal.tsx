import type { ReactElement } from "react";
import "./style.css";
import { MdOutlineClose } from "react-icons/md";
import Loading from "../loading/Loading";
import Button from "../button/Button";
interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onAction: () => void;
  loading?: boolean;
  message?: ReactElement | string;
  type?: "info" | "danger";
}

const ConfirmModal = ({ open, onClose, message, onAction, loading = false, type = "danger" }: ConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="backdrop">
      <div className="modal">
        <div className={`header-modal type-${type}`}>
          <span className="title-modal">Confirmar ação</span>
          <MdOutlineClose onClick={onClose} className="icon-close" title="Fechar" color="black" />
        </div>

        <div className="content-modal">
          <p className="message-modal">{message || "Confirme no botão abaixo se deseja realmente prosseguir"}</p>
        </div>

        <div className="actions-modal">
          <Button
            label={loading ? <Loading withMessage={false} size="sm" /> : "Confirmar"}
            disabled={loading}
            onClick={onAction}
            variant={type === "danger" ? type : "primary"}
          />
          <Button label="Cancelar" onClick={onClose} variant={"secondary"} />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
