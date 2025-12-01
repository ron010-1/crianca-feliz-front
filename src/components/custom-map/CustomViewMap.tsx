import type { ReactNode } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const DEFAULT_ZOOM_MAP = 13;

interface CustomViewMapProps {
  markers?: {
    localizacao: number[];
    popup?: ReactNode;
  }[];
  center: number[];
  zoom?: number;
  scrollZoom?: boolean;
}

const CustomViewMap = ({ zoom = DEFAULT_ZOOM_MAP, markers, center, scrollZoom = true }: CustomViewMapProps) => {
  return (
    <MapContainer
      center={center as [number, number]}
      zoom={zoom}
      scrollWheelZoom={scrollZoom}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers ? (
        markers.map((m, i) => (
          <Marker key={i} position={m.localizacao as [number, number]}>
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))
      ) : (
        <Marker position={center as [number, number]}></Marker>
      )}
    </MapContainer>
  );
};

export default CustomViewMap;
