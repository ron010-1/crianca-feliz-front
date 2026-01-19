import { useEffect, type ReactNode } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { BotaoMinhaLocalizacao } from "./BotaoMinhaLocalizacao";

const DEFAULT_ZOOM_MAP = 13;
const FALLBACK_LOCATION_BR: [number, number] = [-14.235, -51.9253];

function LocationMarker({ onChange }: { onChange: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onChange([lat, lng]);
    },
  });
  return null;
}

function LocalizarUserEAtualizarMapa({ center }: { center?: number[] }) {
  const map = useMap();

  useEffect(() => {
    if (!center || !center.length) {
      map.locate({ setView: true });

      return;
    }
    map.setView(center as [number, number], map.getZoom());
  }, [center, map]);

  return null;
}

interface CustomViewMapProps {
  markers?: {
    localizacao: number[];
    popup?: ReactNode;
  }[];
  center?: number[];
  zoom?: number;
  scrollZoom?: boolean;
  onSelectLocation?: (coords: number[]) => void;
}

const CustomViewMap = ({
  zoom = DEFAULT_ZOOM_MAP,
  markers,
  center,
  scrollZoom = true,
  onSelectLocation,
}: CustomViewMapProps) => {
  const centerExist = center && center.length === 2;
  const initialCenter = centerExist ? (center as [number, number]) : FALLBACK_LOCATION_BR;

  return (
    <MapContainer
      center={initialCenter}
      zoom={centerExist ? zoom : 4}
      scrollWheelZoom={scrollZoom}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocalizarUserEAtualizarMapa center={center} />

      {onSelectLocation && <BotaoMinhaLocalizacao onLocationFound={onSelectLocation} />}

      {onSelectLocation && <LocationMarker onChange={onSelectLocation} />}

      {markers
        ? markers.map((m, i) => (
            <Marker key={i} position={m.localizacao as [number, number]}>
              {m.popup && <Popup>{m.popup}</Popup>}
            </Marker>
          ))
        : centerExist && <Marker position={initialCenter} />}
    </MapContainer>
  );
};

export default CustomViewMap;
