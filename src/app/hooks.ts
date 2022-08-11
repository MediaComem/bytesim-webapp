import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { selectZone } from "../features/zones/zonesSlice";
import simulationService from "../services/simulationService";
import { AppDispatch, RootState } from "./store";
import { Recommandation } from "./types/recommandations";
import { ZoneParamsType } from "./types/types";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function calculateRecommandationsForZone(
  zoneId: string
): Recommandation<ZoneParamsType[keyof ZoneParamsType]>[] {
  const existingZone = useAppSelector((state) => selectZone(state, zoneId));
  let recommandations: Recommandation<any>[] = [];
  if (existingZone) {
    try {
      const simulator = simulationService.simulator(existingZone);
      if (simulator) {
        const { energy, co2 } = simulator.simulate();
        console.log(
          `impact zone ${existingZone.name}: ${energy} MJ - ${co2} kg Co2eq`
        );
        recommandations = simulator.recommandations();
        console.log(recommandations);
      }
    } catch (e) {
    console.log(e);
    }
  }
  return recommandations;
}
