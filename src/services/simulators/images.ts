import { ImageParameters } from "../../app/types/imgTypes";
import { Recommandation } from "../../app/types/recommandations";
import { Zone } from "../../app/types/types";
import { SimulatorImages } from "./type";
import { ZoneSimulator } from "./zoneSimulator";

export class ImageSimulator extends ZoneSimulator implements SimulatorImages {
  images: ImageParameters;
  renewable: boolean;

  constructor(zone: Zone, renewable: boolean) {
    super(zone.id);
    this.images = zone.params;
    this.renewable = renewable;
  }

  simulate() {
    return { energy: 0, co2: 0 };
  }

  recommandations(): Recommandation<any>[] {
    return [];
  }
}
