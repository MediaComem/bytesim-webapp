import { Recommandation } from "../../app/types/recommandations";
import { VideoParameters } from "../../app/types/videoTypes";
import { ImagesParameters } from "../../app/types/imgTypes";
import { GenericParameters } from "../../app/types/generalFormTypes";

export interface Simulator {
  simulate: () => { energy: number; co2: number };
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
    ImagesParameters[keyof ImagesParameters]
  >[];
}
