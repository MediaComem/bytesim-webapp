import { GenericParameters, ServerType } from "../../app/types/generalFormTypes";
import { Recommandation, RecommandationTypes } from "../../app/types/recommandations";
import { SimulatorGeneric } from "./type";

export class GenericParametersSimulator implements SimulatorGeneric {
  parameters: GenericParameters;

  constructor(parameters: GenericParameters) {
    this.parameters = parameters;
  }

  simulate() {
    return { energy: 0, co2: 0 };
  }

  recommandations(): Recommandation<GenericParameters[keyof GenericParameters]>[] {
    if (this.parameters.server !== ServerType.RENEWABLE) {
      return [{
        id: 'energy',
        type: RecommandationTypes.BETTER_VALUE,
        zone_id: 'generic',
        parameter: 'server',
        currentValue: this.parameters.server,
        betterValue: ServerType.RENEWABLE,
        benefitsBetter: {
          energy: 0, // TODO
          co2: 0 // TODO
        }
      }];
    }
    return [];
  }
}