import { nanoid } from "@reduxjs/toolkit";
import {
  EServerType,
  GenericParameters,
} from "../../app/types/generalFormTypes";
import {
  BestPracticeMessage,
  Recommandation,
  RecommandationTypes,
} from "../../app/types/recommandations";
import { EBoolean } from "../../app/types/types";
import { genericTips, genericWarning } from "./messages";
import { SimulatorGeneric } from "./type";

export class GenericParametersSimulator implements SimulatorGeneric {
  parameters: GenericParameters;

  constructor(parameters: GenericParameters) {
    this.parameters = parameters;
  }

  simulate() {
    return { energy: 0, co2: 0 };
  }

  simulateOptimal() {
    return { energy: 0, co2: 0 };
  }

  /**
   * @note assume that the best param is a the first position
   * @param options choices for the user
   * @param currentParameters params of the zone
   * @param key key of the param to create recommandation
   * @param type type of
   * @param warningMessage the warning displayed to the user
   * @returns a warning or tip message recommandation
   */
  messageForBetterRecommandations(
    options: { [s: string]: unknown } | ArrayLike<unknown>,
    currentParameters: { [x: string]: any },
    key: string,
    type: RecommandationTypes.WARNING | RecommandationTypes.TIP,
    message: string,
    bestPracticeMessage?: BestPracticeMessage,
  ) {
    const recommandations: Recommandation<any>[] = [];
    const currentChoice = currentParameters[key];
    if (
      Object.values(options).findIndex((option) => option === currentChoice) > 0
    ) {
      const reco: Recommandation<any> = {
        id: nanoid(),
        type,
        zone_id: "generic",
        parameter: key,
        message,
        bestPracticeMessage,
      };
      recommandations.push(reco);
    }
    return recommandations;
  }

  recommandations(): Recommandation<
    GenericParameters[keyof GenericParameters]
  >[] {
    const recommendations: Recommandation<EServerType>[] = [];
    if (this.parameters.server !== EServerType.RENEWABLE) {
      recommendations.push({
        id: "energy",
        type: RecommandationTypes.BETTER_VALUE,
        zone_id: "generic",
        parameter: "server",
        currentValue: this.parameters.server,
        betterValue: EServerType.RENEWABLE,
        benefitsBetter: {
          energy: 0, // TODO
          co2: 0, // TODO
        },
        bestPracticeMessage: {
          title: "Does the electricity come from renewable energies ?",
          body: "The activity of a data center requires energy. The energy sources will determine the environmental footprint. Low-carbon and renewable energy solutions will reduce this impact.",
          link: "https://gr491.isit-europe.org/en/crit.php?id=4-8039-hosting-the-activity-of-a-data-center-requires",
        },
      });
    }
    const recommandationsPlugins = this.messageForBetterRecommandations(
      EBoolean,
      this.parameters,
      "plugins",
      RecommandationTypes.TIP,
      genericTips.plugins,
      {
        title: "Do the libraries used allow you to take only the components that are actually useful ?",
        body: "Very often components from public libraries (open source or commercial) provide a set of functionalities which are rarely all used and drain dependencies on other components with the same characteristics. In the end, the project aggregates a large volume of the library while a small part is actually used. Favoring components whose dependencies and functionalities are controllable in relation to the needs is efficient from the sustainable IT point of view.",
        link: "https://gr491.isit-europe.org/en/crit.php?id=3-5019-frontend-very-often-components-from-public-libraries-",
      },
    );
    recommendations.push(...recommandationsPlugins);
    const recommandationsCustomFont = this.messageForBetterRecommandations(
      EBoolean,
      this.parameters,
      "customFonts",
      RecommandationTypes.TIP,
      genericTips.customFonts,
      {
        title: "Do you limit the number of fonts loaded for the service ?",
        body: "Each font is encoded in a file presenting all the associated symbols, which represents a large volume of data exchanged and manipulated. The system fonts are embedded in the presentation tools and are not conveyed, the flows are therefore reduced when they are used.",
        link: "https://gr491.isit-europe.org/en/crit.php?id=9-5075-frontend-each-font-is-encoded-in-a-file",
      }
    );
    recommendations.push(...recommandationsCustomFont);
    const recommandationsInfiniteScroll = this.messageForBetterRecommandations(
      EBoolean,
      this.parameters,
      "infiniteScroll",
      RecommandationTypes.WARNING,
      genericWarning.infiniteScroll,
      {
        title: "Is the size of data stored on user device limited ?",
        body: "All items transfered to user device have impact on the network, on compute time required to process. Reducing the size of these items is important.",
        link: "https://gr491.isit-europe.org/en/crit.php?id=10-5085-frontend-all-items-transfered-to-user-device-have",
      }
    );
    recommendations.push(...recommandationsInfiniteScroll);
    return recommendations;
  }
}
