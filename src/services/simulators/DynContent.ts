import { DynContentParameters, EDynContent } from "../../app/types/dynContentTypes";
import { Recommandation, RecommandationTypes } from "../../app/types/recommandations";
import { Zone } from "../../app/types/types";
import { isZoneComplete } from "../../utils/utils";
import simulationService from "../simulationService";
import { dynContentTips } from "./messages";
import { SimulatorDynContent } from "./type";
import { ZoneSimulator } from "./zoneSimulator";

export class DynContentSimulator extends ZoneSimulator implements SimulatorDynContent {
  dynContent: DynContentParameters;
  renewable: boolean;
  zone: Zone;

  constructor(zone: Zone, renewable: boolean, numberOfVisits: number) {
    super(zone.id, numberOfVisits);
    this.numberOfVisits = numberOfVisits;
    this.dynContent = zone.params;
    this.renewable = renewable;
    this.zone_id = zone.id;
    this.zone = zone;
  }

  // Image size in bytes
  private contentSize(params: DynContentParameters) {
    const contentSize: { [key in EDynContent]: number } = {
      [EDynContent.DYN_CONT_DYNAMIC_MAP]: 870, // Consumption calculated with an iFrame on page https://www.vs.ch/web/sfnp/arrondissement-forestier-du-valais-central
      [EDynContent.DYN_CONT_ADVERTISING]: 1500, // Average consumption based on https://www.24heures.ch/ and https://www.letemps.ch/ datas
      // Average consumption based on https://www.24heures.ch/ and https://www.letemps.ch/ datas
      // Note: comsuption is only based on page load. For futur versions, additional server's data consumption should be taken into consideration too.
      [EDynContent.DYN_CONT_ANYLYTICS]: 1500,
    };

    const sizeMb = (1000 * contentSize[params.content!]);

    return sizeMb;
  }

  protected simulateParameters(params: DynContentParameters): {
    energy: number;
    co2: number;
  } {
    const contentSize = this.contentSize(params);
    const energy = simulationService.energyMJ(contentSize, this.renewable) * this.numberOfVisits;
    const co2 = simulationService.gwp(contentSize, this.renewable) * this.numberOfVisits;
    return { energy, co2 };
  }

  simulate() {
    return this.simulateParameters(this.dynContent);
  }

  simulateOptimal() {
    return this.simulate();
  }

  recommandations() {
    const recommandations: Recommandation<EDynContent>[] = [];
    let tipMessage: string = "";
    switch (this.dynContent.content) {
      case EDynContent.DYN_CONT_DYNAMIC_MAP:
        tipMessage = dynContentTips.dynamicMap;
        break;
      case EDynContent.DYN_CONT_ADVERTISING:
        tipMessage = dynContentTips.advertising;
        break;
      case EDynContent.DYN_CONT_ANYLYTICS:
        tipMessage = dynContentTips.analytics;
        break;
      default:
        break;
    }
    //show recommandations only if the zone params are fully filled
    if (isZoneComplete(this.zone)) {
      const recommandationsFormat = this.messageRecommandations(
        "content",
        RecommandationTypes.TIP,
        tipMessage
      );
      recommandations.push(...recommandationsFormat);
    }
    return recommandations;
  }
}
