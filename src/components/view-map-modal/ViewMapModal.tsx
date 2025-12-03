import { MdOutlineClose } from "react-icons/md";
import type { BeneficiarioType } from "../../models/beneficiario";
import "./style.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

interface ViewMapModalProps {
  open: boolean;
  onClose: () => void;
  beneficiario: BeneficiarioType;
}

const ViewMapModal = ({ open, onClose, beneficiario }: ViewMapModalProps) => {
  if (!open) return null;

  const [latitude, longitude] = beneficiario.location;

  return (
    <div className="backdrop">
      <div className="view-modal">
        <div className="view-header-modal">
          <span className="view-title-modal">
            Localização do beneficiário(a) <strong>{beneficiario.name}</strong>
          </span>
          <MdOutlineClose onClick={onClose} className="icon-close" title="Fechar" role="button"/>
        </div>

        <div className="view-content-modal" role="dialog">
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]}></Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default ViewMapModal;
