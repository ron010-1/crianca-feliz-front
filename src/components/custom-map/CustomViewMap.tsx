import type { ReactNode } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const DEFAULT_ZOOM_MAP = 13;

interface CustomViewMapProps {
  markers: {
    localizacao: [number, number];
    popup?: ReactNode;
  }[];
  center: [number, number];
  zoom?: number;
  scrollZoom?: boolean;
}

const CustomViewMap = ({ zoom = DEFAULT_ZOOM_MAP, markers, center, scrollZoom = true }: CustomViewMapProps) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollZoom}
      style={{ minHeight: "400px", minWidth: "500px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m, i) => (
        <Marker key={i} position={m.localizacao}>
          {m.popup && <Popup>{m.popup}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CustomViewMap;
