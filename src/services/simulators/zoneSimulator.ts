import { nanoid } from "@reduxjs/toolkit";
import { Recommandation } from "../../app/types/recommandations";

export class ZoneSimulator {
  zone_id: string;

  constructor(id: string) {
    this.zone_id = id;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected simulateParameters(params: unknown): {energy: number, co2: number} {
    throw (new Error('simulateParameters has to be implemented by main class'));
  }

  recommandations4Parameter(currentImpact: {energy: number, co2: number}, options: { [s: string]: unknown; } | ArrayLike<unknown>, currentParameters: { [x: string]: any; }, key: string) {
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
          [key]: better
        };
        const { energy: energyBetter, co2: co2Better } = this.simulateParameters(betterParams);
        const recommandation: Recommandation<any> = {
          id: nanoid(),
          zone_id: this.zone_id,
          parameter: key,
          currentValue: currentChoice,
          betterValue: better,
          benefitsBetter: {
            energy: currentImpact.energy - energyBetter,
            co2: currentImpact.co2 - co2Better
          }
        }

        if (idx > 1) {
          // best option
          const best = choices[0];
          const bestParams = {
            ...currentParameters,
            [key]: best
          };
          const { energy: energyBest, co2: co2Best } = this.simulateParameters(bestParams);
          recommandation.bestValue = best;
          recommandation.benefitsBest = {
            energy: currentImpact.energy - energyBest,
            co2: currentImpact.co2 - co2Best
          };
        }
        recommandations.push(recommandation);
      }
    }
    return recommandations;
  }
}
