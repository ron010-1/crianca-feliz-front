import { MdOutlineMyLocation } from "react-icons/md";
import { useMap } from "react-leaflet";

export const BotaoMinhaLocalizacao = ({ onLocationFound }: { onLocationFound: (coords: number[]) => void }) => {
  const map = useMap();

  const handleLocate = () => {
    map.locate({ setView: true });

    map.once("locationfound", (e) => {
      onLocationFound([e.latlng.lat, e.latlng.lng]);
    });

    map.on("locationerror", () => {
      alert("Não foi possível acessar sua localização. Verifique as permissões do navegador.");
    });
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ marginRight: "5px" }}>
      <div className="leaflet-control leaflet-bar">
        <button
          type="button"
          onClick={handleLocate}
          title="Minha Localização"
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          <MdOutlineMyLocation />
        </button>
      </div>
    </div>
  );
};
