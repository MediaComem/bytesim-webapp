import { nanoid } from "@reduxjs/toolkit";
import { Recommandation } from "../../app/types/recommandations";
import { EBoolean } from "../../app/types/types";

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
      //Best choice - need this to keep track of previous recommendations
      /*if (idx === 0) {
        const bestOption: Recommandation<any> = {
          id: nanoid(),
          type: 'betterValue',
          zone_id: this.zone_id,
          parameter: key,
          currentValue: currentChoice,
          betterValue: null,
          benefitsBetter: {
            energy: 0,
            co2: 0,
          },
        };
        recommandations.push(bestOption);
      }*/
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
          type: 'betterValue',
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
   * @note assume that the params should be set to false for positive impact
   * @param currentImpact
   * @param currentParameters
   * @param warningMessage the warning displayed to the user
   * @param key
   * @returns
   */
  badPracticeRecommandations(
    currentImpact: { energy: number; co2: number },
    options: { [s: string]: unknown } | ArrayLike<unknown>,
    currentParameters: { [x: string]: any },
    key: string,
    warningMessage: string
  ) {
    const recommandations: Recommandation<any>[] = [];
    const currentChoice = currentParameters[key];
    if (Object.values(options).findIndex(option => option === currentChoice) > 0) {
      //Best choice - need this to keep track of previous recommendations
        const bestOption: Recommandation<any> = {
          id: nanoid(),
          type: 'warning',
          zone_id: this.zone_id,
          parameter: key,
          warningMessage
        };
        recommandations.push(bestOption);
    }
    return recommandations;
  }
}
