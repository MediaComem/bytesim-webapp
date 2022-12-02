import { nanoid } from "@reduxjs/toolkit";
import { EServerType, GenericParameters } from "../../app/types/generalFormTypes";
import { Recommandation, RecommandationTypes } from "../../app/types/recommandations";
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
    message: string
  ) {
    const recommandations: Recommandation<any>[] = [];
    const currentChoice = currentParameters[key];
    if (Object.values(options).findIndex(option => option === currentChoice) > 0) {
        const reco: Recommandation<any> = {
          id: nanoid(),
          type,
          zone_id: 'generic',
          parameter: key,
          message
        };
        recommandations.push(reco);
    }
    return recommandations;
  }

  recommandations(): Recommandation<GenericParameters[keyof GenericParameters]>[] {
    const recommendations: Recommandation<EServerType>[] = [];
    if (this.parameters.server !== EServerType.RENEWABLE) {
      recommendations.push({
        id: 'energy',
        type: RecommandationTypes.BETTER_VALUE,
        zone_id: 'generic',
        parameter: 'server',
        currentValue: this.parameters.server,
        betterValue: EServerType.RENEWABLE,
        benefitsBetter: {
          energy: 0, // TODO
          co2: 0 // TODO
        }
      });
    }
    const recommandationsPlugins = this.messageForBetterRecommandations(
        EBoolean,
        this.parameters,
        "plugins",
        RecommandationTypes.TIP,
        genericTips.plugins
      );
    recommendations.push(...recommandationsPlugins);
    const recommandationsCustomFont = this.messageForBetterRecommandations(
        EBoolean,
        this.parameters,
        "customFonts",
        RecommandationTypes.TIP,
        genericTips.customFonts
      );
    recommendations.push(...recommandationsCustomFont);
    const recommandationsInfiniteScroll = this.messageForBetterRecommandations(
        EBoolean,
        this.parameters,
        "infiniteScroll",
        RecommandationTypes.WARNING,
        genericWarning.infiniteScroll
      );
    recommendations.push(...recommandationsInfiniteScroll);
    return recommendations;
  }
}