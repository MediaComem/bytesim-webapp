import { ImageParameters } from "../../app/types/imgTypes";
import { Recommandation } from "../../app/types/recommandations";
import { Zone, ZoneFigma } from "../../app/types/types";
import { SimulatorImages } from "./type";
import { ZoneSimulator } from "./zoneSimulator";

export class ImageSimulator extends ZoneSimulator implements SimulatorImages {
  images: ImageParameters;
  renewable: boolean;
  numberOfVisits: number;

  constructor(zone: Zone | ZoneFigma, renewable: boolean, numberOfVisits: number) {
    super(zone.id, numberOfVisits);
    this.images = zone.params;
    this.renewable = renewable;
    this.numberOfVisits = numberOfVisits;
  }

  simulate() {
    return { energy: 0, co2: 0 };
  }

  recommandations(): Recommandation<any>[] {
    return [];
  }
}
