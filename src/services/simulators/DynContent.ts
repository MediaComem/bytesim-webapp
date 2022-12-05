import { DynContentParameters, EDynContent } from "../../app/types/dynContentTypes";
import { BestPracticeMessage, Recommandation, RecommandationTypes } from "../../app/types/recommandations";
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
    let BP: BestPracticeMessage = {}
    switch (this.dynContent.content) {
      case EDynContent.DYN_CONT_DYNAMIC_MAP:
        tipMessage = dynContentTips.dynamicMap;
        BP = {
          title: 'Are cartography objects, animations, videos presented in a static mode ?',
          body: 'Mapping objects are not always relevant to be presented in the form of dynamic and interactive objects. The static image version of the plans can provide the user with enough information without having to interact with the object. Mapping objects are complex and require processing resources and the use of sensors, which the image versions of plans avoid. The user retains the possibility of interaction by activating the dynamic version but only at his request.',
          link: 'https://gr491.isit-europe.org/en/crit.php?id=10-5082-frontend-mapping-objects-are-not-always-relevant-to'
        };
        break;
      case EDynContent.DYN_CONT_ADVERTISING:
        tipMessage = dynContentTips.advertising;
        BP = {
          title: 'Is user attention captured with their consent and for the uses they expect ?',
          body: 'The attention of the user is a resource that should be considered scarce and valuable. From this perspective, respect for the user also depends on his ability to focus his attention on the elements of his choice, rather than those that the service would like to highlight.',
          link: 'https://gr491.isit-europe.org/en/crit.php?id=8-5057-frontend-the-attention-of-the-user-is-a'
        };
        break;
      case EDynContent.DYN_CONT_ANYLYTICS:
        tipMessage = dynContentTips.analytics;
        BP = {
          title: 'Is the data fed back by the APIs really only the data that the application needs when it is requested ?',
          body: 'The journeys and needs of users are very difficult to anticipate. One trend is to collect as much front end data as possible to cover as many use cases as possible. This practice is inefficient from an IT point of view. Sustainable because the collection, the processing, the routing, the local storage of the data generates a load and therefore a significant energy consumption without certainty that all this data will actually be used. The service footprint must be reduced by collecting only essential data as the service unfolds through API mechanisms.',
          link: 'https://gr491.isit-europe.org/en/crit.php?id=3-5017-frontend-the-journeys-and-needs-of-users-are'
        };
        break;
      default:
        break;
    }
    //show recommandations only if the zone params are fully filled
    if (isZoneComplete(this.zone)) {
      const recommandationsFormat = this.messageRecommandations(
        "content",
        RecommandationTypes.TIP,
        tipMessage,
        BP
      );
      recommandations.push(...recommandationsFormat);
    }
    return recommandations;
  }
}
