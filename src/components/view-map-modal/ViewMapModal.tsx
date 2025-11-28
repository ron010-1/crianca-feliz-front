import { MdOutlineClose } from "react-icons/md";
import CustomViewMap from "../custom-map/CustomViewMap";
import type { BeneficiarioType } from "../../models/beneficiario";
import "./style.css";

interface ViewMapModalProps {
  open: boolean;
  onClose: () => void;
  beneficiario: BeneficiarioType;
}

const ViewMapModal = ({ open, onClose, beneficiario }: ViewMapModalProps) => {
  if (!open) return null;

  return (
    <div className="backdrop">
      <div className="view-modal">
        <div className="view-header-modal">
          <span className="view-title-modal">
            Localizacao do beneficiário <strong>{beneficiario.name}</strong>
          </span>
          <MdOutlineClose onClick={onClose} className="icon-close" title="Fechar" />
        </div>

        <div className="view-content-modal">
          <CustomViewMap center={beneficiario.location} />
        </div>
      </div>
    </div>
  );
};

export default ViewMapModal;
