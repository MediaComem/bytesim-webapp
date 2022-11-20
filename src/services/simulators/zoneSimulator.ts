import { nanoid } from "@reduxjs/toolkit";
import { Recommandation, RecommandationTypes } from "../../app/types/recommandations";

export class ZoneSimulator {
  zone_id: string;
  numberOfVisits: number;

  constructor(id: string, numberOfVisits: number) {
    this.zone_id = id;
    this.numberOfVisits = numberOfVisits;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected simulateParameters(params: unknown): {
    energy: number;
    co2: number;
  } {
    throw new Error("simulateParameters has to be implemented by main class");
  }

  betterOptionsRecommandations(
    currentImpact: { energy: number; co2: number },
    options: { [s: string]: unknown } | ArrayLike<unknown>,
    currentParameters: { [x: string]: any },
    key: string
  ) {
    const recommandations: Recommandation<any>[] = [];
    const currentChoice = currentParameters[key];
    if (currentChoice) {
      const choices = Object.values(options);
      const idx = choices.findIndex((option) => option === currentChoice);
      if (idx > 0) {
        // better choice
        const better = choices[idx - 1];
        const betterParams = {
          ...currentParameters,
          [key]: better,
        };
        const { energy: energyBetter, co2: co2Better } =
          this.simulateParameters(betterParams);
        const recommandation: Recommandation<any> = {
          id: nanoid(),
          type: RecommandationTypes.BETTER_VALUE,
          zone_id: this.zone_id,
          parameter: key,
          currentValue: currentChoice,
          betterValue: better,
          benefitsBetter: {
            energy: currentImpact.energy - energyBetter,
            co2: currentImpact.co2 - co2Better,
          },
        };

        if (idx > 1) {
          // best option
          const best = choices[0];
          const bestParams = {
            ...currentParameters,
            [key]: best,
          };
          const { energy: energyBest, co2: co2Best } =
            this.simulateParameters(bestParams);
          recommandation.bestValue = best;
          recommandation.benefitsBest = {
            energy: currentImpact.energy - energyBest,
            co2: currentImpact.co2 - co2Best,
          };
        }
        recommandations.push(recommandation);
      }
    }
    return recommandations;
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
  messageRecommandations(
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
          zone_id: this.zone_id,
          parameter: key,
          message
        };
        recommandations.push(reco);
    }
    return recommandations;
  }

  /**
   * @param currentParameters params of the zone
   * @param key key of the param to create recommandation
   * @param threshold the threshold after which the recommendation is created
   * @param type type of
   * @param warningMessage the warning displayed to the user
   * @returns a warning or tip message recommandation
   */
  quantityMessageRecommandations(
    currentParameters: { [x: string]: any },
    key: string,
    threshold: number,
    type: RecommandationTypes.WARNING | RecommandationTypes.TIP,
    message: string
  ) {
    const recommandations: Recommandation<any>[] = [];
    const currentChoice = currentParameters[key];
    if (currentChoice > threshold) {
      console.warn(currentChoice, threshold);
      const reco: Recommandation<any> = {
          id: nanoid(),
          type,
          zone_id: this.zone_id,
          parameter: key,
          message
        };
        recommandations.push(reco);
    }
    return recommandations;
  }
}
