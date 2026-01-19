import axios from "axios";
import { nominationConstants } from "../../constants/nomination.constants";

export class NominationRequests {
  static async buscarCoordenadasPorEndereco(endereco: string): Promise<{ lat: string; lon: string } | null> {
    const { data } = await axios.get(
      `${nominationConstants.BASE_URL}/search?format=json&q=${encodeURIComponent(endereco)}&countrycodes=br&limit=1`,
    );

    return data && data[0] ? data[0] : null;
  }
}
