import { ImageParameters } from "../../app/types/imgTypes";
import { Recommandation } from "../../app/types/recommandations";
import { SimulatorImages } from "./type";
import { ZoneSimulator } from "./zoneSimulator";

export class ImageSimulator extends ZoneSimulator implements SimulatorImages {
  images: ImageParameters;
  renewable: boolean;

  constructor(id: string, parameters: ImageParameters, renewable: boolean) {
    super(id);
    this.images = parameters;
    this.renewable = renewable;
  }

  simulate() {
    return { energy: 0, co2: 0 };
  }

  recommandations(): Recommandation<any>[] {
    return [];
  }
}
