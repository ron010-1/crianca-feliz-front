import { useMutation } from "@tanstack/react-query";
import Button from "../button/Button";
import CustomViewMap from "../custom-map/CustomViewMap";
import Input from "../Input/Input";
import StylesPage from "./style.module.css";
import { toast } from "react-toastify";
import { NominationRequests } from "../../api/nomination/NominationRequests";
import { useState } from "react";
import Loading from "../loading/Loading";

const SearchLocationMap = ({
  onSelectLocation,
  coords,
}: {
  coords: number[];
  onSelectLocation: (coords: number[]) => void;
}) => {
  const [inputSearchLocation, setInputSearchLocation] = useState<string>("");

  const mutationBuscarLocation = useMutation({
    mutationKey: ["search-location"],
    mutationFn: async () => {
      if (inputSearchLocation) return await NominationRequests.buscarCoordenadasPorEndereco(inputSearchLocation);
    },

    onSuccess(data) {
      if (data) {
        onSelectLocation([parseFloat(data.lat), parseFloat(data.lon)]);
        setInputSearchLocation("");
        return;
      }

      toast.info("Endereço não encontrado!");
    },

    onError: () => {
      toast.error("Erro ao buscar endereço!");
    },
  });

  return (
    <section className={StylesPage.containerLocationAndSearch}>
      <div className={StylesPage.searchLocation}>
        <Input
          placeholder="Digite algum endereço para localizar no mapa.."
          tamanho="lg"
          autoComplete="street-address"
          value={inputSearchLocation}
          onChange={(e) => setInputSearchLocation(e.target.value)}
        />
        <Button
          variant="primary"
          label={mutationBuscarLocation.isPending ? <Loading size="sm" withMessage={false} /> : "Buscar"}
          onClick={mutationBuscarLocation.mutate}
        />
      </div>

      <div className={StylesPage.containerMap}>
        <CustomViewMap center={coords} onSelectLocation={onSelectLocation} />
      </div>
    </section>
  );
};

export default SearchLocationMap;
