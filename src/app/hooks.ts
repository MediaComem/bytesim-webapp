import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import simulationService from "../services/simulationService";
import { isZoneComplete } from "../utils/utils";
import { AppDispatch, RootState } from "./store";
import { GenericParameters, EServerType } from "./types/generalFormTypes";
import {
  Recommandation,
  RecommandationWithZone,
} from "./types/recommandations";
import { Zone } from "./types/types";
import { VideoParameters } from "./types/videoTypes";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const selectZones = (state: RootState) => state.zonesSlice.zones;
export const zoneSelector = createDraftSafeSelector(
  selectZones,
  (state) => state
);

export const useAppZones = () => useAppSelector(zoneSelector);

export function useCalculateImpact(): { energy: number; co2: number } {
  const zones = useAppSelector(zoneSelector);
  const renewable = useAppSelector(
    (state) => state.project.params.server === EServerType.RENEWABLE
  );
  const nbVisits = useAppSelector((state) => state.project.params.nbVisit) ?? 1;
  let energyTotal = 0;
  let co2Total = 0;
  zones.forEach((zone) => {
    if (isZoneComplete(zone)) {
      try {
        const simulator = simulationService.simulator(zone, renewable, nbVisits);
        if (simulator) {
          const { energy, co2 } = simulator.simulate();
          energyTotal += energy;
          co2Total += co2;
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  return { energy: energyTotal, co2: co2Total };
}

export function useCalculateRecommandationsImpact(): {
  energy: number;
  co2: number;
} {
  const zones = useAppSelector(zoneSelector);
  const recommandations = useAppSelector((state) => state.recommandations);
  const nbVisits = useAppSelector((state) => state.project.params.nbVisit) ?? 1; // if no visitor impact per visit
  let renewable = useAppSelector(
    (state) => state.project.params.server === EServerType.RENEWABLE
  );
  let energyTotal = 0;
  let co2Total = 0;
  const recommandationRenewable = recommandations.find(
    (rec) => rec.id === "energy"
  );
  if (recommandationRenewable) {
    renewable = recommandationRenewable.selectedValue === "better";
  }
  zones.forEach((zone) => {
    if (isZoneComplete(zone)) {
      // TODO optimize code + architecture
      const zoneRecommandations = recommandations.filter(
        (rec) => rec.zone_id === zone.id
      );
      const zoneParameters = { ...zone.params };
      const simulatedZone = {
        ...zone,
        id: `simulated_${zone.id}`,
        type: zone.zoneType,
        params: zoneParameters,
      };
      for (const recommandation of zoneRecommandations) {
        if (recommandation.selectedValue === "better") {
          simulatedZone.params[recommandation.parameter] =
            recommandation.betterValue;
        } else if (recommandation.selectedValue === "optimal") {
          simulatedZone.params[recommandation.parameter] =
            recommandation.bestValue;
        }
      }
      try {
        const simulator = simulationService.simulator(simulatedZone, renewable, nbVisits);
        if (simulator) {
          const { energy, co2 } = simulator.simulate();
          energyTotal += energy;
          co2Total += co2;
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  return { energy: energyTotal, co2: co2Total };
}

export function useCalculateGenericRecommandations(): RecommandationWithZone<
  GenericParameters[keyof GenericParameters]
>[] {
  const genericParameters = useAppSelector((state) => state.project.params);
  const recommandations: RecommandationWithZone<
    GenericParameters[keyof GenericParameters]
  >[] = [];
  // Generic recommandations
  const simulator =
    simulationService.genericParametersSimulator(genericParameters);
  if (simulator) {
    const recos = simulator.recommandations();
    recos.forEach((reco) => {
      const rec: RecommandationWithZone<
        GenericParameters[keyof GenericParameters]
      > = { ...reco, zoneId: "generic", zoneName: "Generic" };
      recommandations.push(rec);
    });
  }
  return recommandations;
}

export function useCalculateAllRecommandations(): RecommandationWithZone<
  VideoParameters[keyof VideoParameters]
>[] {
  const zones = useAppZones();
  const genericParameters = useAppSelector((state) => state.project.params);
  const nbVisits = useAppSelector(
    (state) => state.project.params.nbVisit
  ) ?? 1;
  const renewable = genericParameters === EServerType.RENEWABLE;
  const recommandations: RecommandationWithZone<
    VideoParameters[keyof VideoParameters]
  >[] = [];
  zones.forEach((zone) => {
    const recos = useCalculateRecommandationsForZone(zone, renewable, nbVisits);
    recos.forEach((reco) => {
      const rec: RecommandationWithZone<
        VideoParameters[keyof VideoParameters]
      > = { ...reco, zoneId: zone.id!, zoneName: zone.name! };
      recommandations.push(rec);
    });
  });
  return recommandations;
}

export function useCalculateRecommandationsForZone(
  zone: Zone,
  renewable: boolean,
  nbVisits: number
): Recommandation<VideoParameters[keyof VideoParameters]>[] {
  let recommandations: Recommandation<any>[] = [];
  try {
    const simulator = simulationService.simulator(zone, renewable, nbVisits);
    if (simulator) {
      recommandations = simulator.recommandations();
    }
  } catch (e) {
    console.log(e);
  }
  return recommandations;
}

export function useSelectedZone(): Zone | undefined {
  let zone;
  const zones = useAppSelector((state) => state.zonesSlice.zones);
  zones.forEach((z) => {
    if (z.status === "EDITING") zone = z;
  });
  return zone;
}
