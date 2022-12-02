import { EImgFormat, EImgSize, ImageParameters } from "../../app/types/imgTypes";
import { Recommandation, RecommandationTypes } from "../../app/types/recommandations";
import { Zone } from "../../app/types/types";
import { isZoneComplete } from "../../utils/utils";
import simulationService from "../simulationService";
import { imageTips } from "./messages";
import { SimulatorImages } from "./type";
import { ZoneSimulator } from "./zoneSimulator";

export class ImageSimulator extends ZoneSimulator implements SimulatorImages {
  image: ImageParameters;
  renewable: boolean;
  zone: Zone;
  MAX_IMAGE_THRESHOLD: number = 5;

  constructor(zone: Zone, renewable: boolean, numberOfVisits: number) {
    super(zone.id, numberOfVisits);
    this.numberOfVisits = numberOfVisits;
    this.image = zone.params;
    this.renewable = renewable;
    this.zone_id = zone.id;
    this.zone = zone;
  }

  // Image size in bytes
  private imageSize(params: ImageParameters) {
    // An arbitrary average size is chosen for each step
    const imageSize: { [key in EImgSize]: number } = {
      [EImgSize.SIZE_100KO]: 50,
      [EImgSize.SIZE_100_500KO]: 250,
      [EImgSize.SIZE_MORE_500KO]: 2000,
    };

    if (!params.size || !params.quantity) {
      throw new Error(`Missing some parameters for image`);
    }

    const sizeMb = (1000 * imageSize[params.size] * params.quantity);
    return sizeMb;
  }

  protected simulateParameters(params: ImageParameters): {
    energy: number;
    co2: number;
  } {
    const imageSize = this.imageSize(params);
    const energy = simulationService.energyMJ(imageSize, this.renewable) * this.numberOfVisits;
    const co2 = simulationService.gwp(imageSize, this.renewable) * this.numberOfVisits;
    return { energy, co2 };
  }

  simulate() {
    return this.simulateParameters(this.image);
  }

  simulateOptimal() {
    return this.simulateParameters({
      format: EImgFormat.FORMAT_WEBP,
      quantity: 1,
      size: EImgSize.SIZE_100KO
    } as ImageParameters)
  }

  recommandations() {
    const recommandations: Recommandation<EImgSize>[] =
      [];
    const currentImpact = this.simulate();
    //show recommandations only if the zone params are fully filled
    if (isZoneComplete(this.zone)) {
      const recommandationsFormat = this.messageRecommandations(
        EImgFormat,
        this.image,
        "format",
        RecommandationTypes.TIP,
        imageTips.format
      );
      recommandations.push(...recommandationsFormat);
      const recommandationsQuantity = this.quantityMessageRecommandations(
        this.image,
        "quantity",
        this.MAX_IMAGE_THRESHOLD,
        RecommandationTypes.TIP,
        imageTips.quantity
      );
      recommandations.push(...recommandationsQuantity);
      const recommandationsQuality = this.betterOptionsRecommandations(
        currentImpact,
        EImgSize,
        this.image,
        "size"
      );
      recommandations.push(...recommandationsQuality);
    }
    return recommandations;
  }
}
