import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import simulationService from "../services/simulationService";
import { AppDispatch, RootState } from "./store";
import {
  Recommandation,
  RecommandationWithZone,
} from "./types/recommandations";
import { Zone } from "./types/types";
import { VideoParameters } from "./types/videoTypes";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useCalculateAllRecommandations(): RecommandationWithZone<
  VideoParameters[keyof VideoParameters]
>[] {
  const zones = useAppSelector((state) => state.zones);
  //const dispatch = useDispatch();
  const recommandations: RecommandationWithZone<
    VideoParameters[keyof VideoParameters]
  >[] = [];
    zones.forEach((zone) => {
      const recos = useCalculateRecommandationsForZone(zone);
      recos.forEach((reco) => {
        const rec: RecommandationWithZone<
          VideoParameters[keyof VideoParameters]
        > = { ...reco, zoneId: zone.id, zoneName: zone.name };
        recommandations.push(rec);
      });
    });
  return recommandations;
}

/* export const useCalculateAllRecommandations = () => {
  const zones = useAppSelector((state) => state.zones);
  const dispatch = useDispatch();
  const recommandations: RecommandationWithZone<
    VideoParameters[keyof VideoParameters]
  >[] = [];
  function makeRecommandations() {
    zones.forEach((zone) => {
      const recos = useCalculateRecommandationsForZone(zone);
      recos.forEach((reco) => {
        const rec: RecommandationWithZone<
          VideoParameters[keyof VideoParameters]
        > = { ...reco, zoneId: zone.id, zoneName: zone.name };
        recommandations.push(rec);
      });
    });
    React.useEffect(() => {
      dispatch(recommandationsPopulated(recommandations));
    }, [dispatch, recommandations]);
  }
  return { makeRecommandations, recommandations };
} */

export function useCalculateRecommandationsForZone(
  zone: Zone
): Recommandation<VideoParameters[keyof VideoParameters]>[] {
  let recommandations: Recommandation<
    VideoParameters[keyof VideoParameters]
  >[] = [];
    try {
      const simulator = simulationService.simulator(zone);
      if (simulator) {
        recommandations = simulator.recommandations();
      }
    } catch (e) {
      console.log(e);
  }
  return recommandations;
}
