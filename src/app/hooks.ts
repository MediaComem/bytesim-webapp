import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { selectZone } from "../features/zones/zonesSlice";
import simulationService from "../services/simulationService";
import { AppDispatch, RootState } from "./store";
import {
  Recommandation,
  RecommandationWithZone,
} from "./types/recommandations";
import { VideoParameters } from "./types/videoTypes";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function calculateAllRecommandations(): RecommandationWithZone<
  VideoParameters[keyof VideoParameters]
>[] {
  const zones = useAppSelector((state) => state.zones);
  const recommandations: RecommandationWithZone<
    VideoParameters[keyof VideoParameters]
  >[] = [];
  zones.forEach((zone) => {
    const recos = calculateRecommandationsForZone(zone.id);
    recos.forEach((reco) => {
      const rec: RecommandationWithZone<
        VideoParameters[keyof VideoParameters]
      > = { ...reco, zoneId: zone.id, zoneName: zone.name };
      recommandations.push(rec);
    });
  });
  return recommandations;
}

export function calculateRecommandationsForZone(
  zoneId: string
): Recommandation<VideoParameters[keyof VideoParameters]>[] {
  const existingZone = useAppSelector((state) => selectZone(state, zoneId));
  let recommandations: Recommandation<
    VideoParameters[keyof VideoParameters]
  >[] = [];
  if (existingZone) {
    try {
      const simulator = simulationService.simulator(existingZone);
      if (simulator) {
        /* const { energy, co2 } = simulator.simulate();
        console.log(
          `impact zone ${existingZone.name}: ${energy} MJ - ${co2} kg Co2eq`
        ); */
        recommandations = simulator.recommandations();
        //console.log(recommandations);
      }
    } catch (e) {
      console.log(e);
    }
  }
  return recommandations;
}
