import { Recommandation } from "../../app/types/recommandations";
import { VideoParameters } from "../../app/types/videoTypes";
import { ImageParameters } from "../../app/types/imgTypes";
import { GenericParameters } from "../../app/types/generalFormTypes";
import { DynContentParameters } from "../../app/types/dynContentTypes";

export interface Simulator {
  simulate: () => { energy: number; co2: number };
  simulateOptimal: () => { energy: number; co2: number };
}

export interface SimulatorGeneric extends Simulator {
  recommandations: () => Recommandation<
    GenericParameters[keyof GenericParameters]
  >[];
}

export interface SimulatorVideo extends Simulator {
  recommandations: () => Recommandation<
    VideoParameters[keyof VideoParameters]
  >[];
}

export interface SimulatorImages extends Simulator {
  recommandations: () => Recommandation<
    ImageParameters[keyof ImageParameters]
  >[];
}

export interface SimulatorDynContent extends Simulator {
  recommandations: () => Recommandation<
    DynContentParameters[keyof DynContentParameters]
  >[];
}
