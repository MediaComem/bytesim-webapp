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

    const sizeMb = (1000 * imageSize[params.size!] * params.quantity!);
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
      const recommandationsFormat = this.messageForBetterRecommandations(
        EImgFormat,
        this.image,
        "format",
        RecommandationTypes.TIP,
        imageTips.format,
        {
          title: 'Have the different image formats available been evaluated to select only the most effective ?',
          body: 'Digital services use images for illustration or information purposes. The sizes, degrees of definition, encoding formats have a significant impact on the size of the files of these images. Reducing volumes makes it possible to limit environmental footprints.',
          link: 'https://gr491.isit-europe.org/en/crit.php?id=9-5061-frontend-digital-services-use-images-for-illustration-or'
        }
      );
      recommandations.push(...recommandationsFormat);
      const recommandationsQuantity = this.quantityMessageRecommandations(
        this.image,
        "quantity",
        this.MAX_IMAGE_THRESHOLD,
        RecommandationTypes.TIP,
        imageTips.quantity,
        {
          title: 'Are you reducing the number of pictograms used in the service ?',
          body: 'All presentation elements have a weight greater than the characters of the alphabet. Each time a pictogram is used when the information it conveys could be presented differently, the service increases its volume. In addition, accessibility assistants do not always make it possible to render these pictograms in good conditions.',
          link: 'https://gr491.isit-europe.org/en/crit.php?id=9-5074-frontend-all-presentation-elements-have-a-weight-greater'
        }
      );
      recommandations.push(...recommandationsQuantity);
      const recommandationsQuality = this.betterOptionsRecommandations(
        currentImpact,
        EImgSize,
        this.image,
        "size",
        {
          title: 'Is the definition of the image reduced and adapted to its objective (illustration, contractual, ...) ?',
          body: 'Illustrative images and images that carry more contractual information such as the image of a product do not have the same needs for quality details. The adaptation of the level of quality to the importance of the image makes it possible to reduce the environmental footprint of the less critical needs for the service.',
          link: 'https://gr491.isit-europe.org/en/crit.php?id=9-5063-frontend-illustrative-images-and-images-that-carry-more'
        }
      );
      recommandations.push(...recommandationsQuality);
    }
    return recommandations;
  }
}
