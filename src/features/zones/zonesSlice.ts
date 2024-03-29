import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  TreeZoneEl,
  Zone,
  ZoneMissingParams,
  ZoneStatus,
} from "../../app/types/types";
import { getMissingZoneParams, isZoneComplete } from "../../utils/utils";
import {
  getChildrenIdsOfTree,
  getParentsOfNode,
  getRelativePosition,
  getImageDimensions,
} from "../importImage/utils";

type ZoneStore = { zones: Zone[]; tree: TreeZoneEl[]; isNew: boolean };
const initialState: ZoneStore = {
  zones: [],
  tree: [],
  isNew: false,
};

const updateZoneBy = (
  state: ZoneStore,
  zoneToAdd: Partial<Zone>,
  by: "elementId" | "id"
) => {
  const zoneFound = state?.zones?.find(
    (zone) => zone[by] && zone?.[by] === zoneToAdd?.[by]
  );
  const existingZone = zoneFound ?? {
    ...zoneToAdd,
    id: nanoid(),
  };
  if (zoneFound) {
    return Object.assign(existingZone, { ...zoneToAdd, ...existingZone });
  }
  if (!state.zones) state.zones = [];
  state?.zones.push(existingZone as Zone);
};

export const defaultZone: Zone = {
  id: "0",
  name: "defaultZone",
  width: 100,
  height: 100,
  x: 100,
  y: 100,
  status: "EDITING",
  zoneType: undefined,
  params: {},
  createdFrom: "user",
};
export const defaultFigmaZone: Zone = {
  ...defaultZone,
  status: "ACTIVE",
  createdFrom: "figma",
};

const zonesSlice = createSlice({
  name: "zones",
  initialState,
  reducers: {
    zoneAdded: {
      reducer(state, action: PayloadAction<Pick<Zone, "id">>) {
        const containerDim = getImageDimensions();
        const newPayload: Zone = {
          ...defaultZone,
          ...action.payload,
          containerLastWidth: containerDim?.width,
          containerLastHeight: containerDim?.height,
          name: `Zone ${state.zones.length + 1}`,
        };
        state.zones.forEach((zone) => {
          zone.status = "ACTIVE";
        });
        state.zones.push(newPayload);
      },
      prepare() {
        return {
          payload: {
            id: nanoid(),
          },
        };
      },
    },
    zoneReset(state, action: PayloadAction<string>) {
      const existingZone = state.zones.find(
        (zone) => zone.id === action.payload
      );
      if (existingZone) {
        const resetParams = {
          id: existingZone.id,
          params: {},
          zoneType: undefined,
        };
        Object.assign(existingZone, resetParams);
      }
    },
    zonesFilterByElementId(state, action: PayloadAction<string[]>) {
      const elementsId = action.payload;
      state.zones = state.zones.filter(
        (zone) => zone.elementId && elementsId?.includes(zone.elementId)
      );
    },
    zoneDeleted(state, action: PayloadAction<string>) {
      const existingZone = state.zones.find(
        (zone) => zone.id === action.payload
      );
      if (existingZone) {
        state.zones.splice(state.zones.indexOf(existingZone), 1);
      }
    },
    zoneActiveToggled(state, action: PayloadAction<string>) {
      const existingZone = state.zones.find(
        (zone) => zone.id === action.payload
      );
      if (existingZone) {
        if (existingZone?.status === "EDITING") {
          existingZone.status = "ACTIVE";
          return;
        }
        state.zones.forEach((s) => {
          s.status = "ACTIVE";
        });
        existingZone.status = "EDITING";
      }
    },
    zoneActivate(state, action: PayloadAction<string>) {
      const existingZone = state.zones.find(
        (zone) => zone.id === action.payload
      );
      if (existingZone) {
        state.zones.forEach((s) => {
          s.status = "ACTIVE";
        });
        existingZone.status = "EDITING";
      }
    },
    allZonesReset(state) {
      return {
        ...state,
        zones: state.zones.map((z) => {
          return {
            ...z,
            zoneType: undefined,
            params: {},
            ...(z.createdFrom === "figma" && {
              width: z.initWidth!,
              height: z.initHeight!,
              x: z.initX!,
              y: z.initY!,
            }),
          };
        }),
      };
    },
    zoneUpdated(state, action: PayloadAction<Partial<Zone>>) {
      const zoneFound = state.zones.find(
        (zone) => zone.id === action.payload?.id
      );
      const existingZone = zoneFound ?? {
        ...defaultZone,
        ...action.payload,
        id: nanoid(),
      };

      Object.assign(existingZone, action.payload);
      updateZoneBy(state, action.payload, "id");
    },
    zoneDuplicated(state, action: PayloadAction<Zone>) {
      const newZone: Zone = {
        ...action.payload,
        name: `${action.payload.name} - copy `,
        status: "EDITING",
        createdFrom: "user",
        id: nanoid(),
      };
      state.zones.forEach((zone) => {
        zone.status = "ACTIVE";
      });
      state.zones.push(newZone);
    },
    zonesUpdatedByElementId(state, action: PayloadAction<Partial<Zone>[]>) {
      action.payload?.forEach((zoneToAdd) => {
        if (zoneToAdd) updateZoneBy(state, zoneToAdd, "elementId");
      });
    },
    zonesUpdatePosition(
      state,
      action: PayloadAction<{
        containerWidth?: number;
        containerHeight?: number;
      }>
    ) {
      // get all zones with elementId
      state.zones = state.zones.map((zone) => {
        if (zone.createdFrom === "figma") {
          if (!zone.elementId) return zone;
          return { ...zone, ...getRelativePosition(zone.elementId) };
        }
        // drawn zone
        const { containerWidth, containerHeight } = action.payload;
        if (!containerWidth || !containerHeight) return zone;
        // ratio between containerLastWidth anda action.containerWidth
        const ratioWidth = containerWidth / (zone.containerLastWidth ?? 1);
        const ratioHeight = containerHeight / (zone.containerLastHeight ?? 1);
        return {
          ...zone,
          x: zone.x * ratioWidth,
          y: zone.y * ratioHeight,
          width: zone.width * ratioWidth,
          height: zone.height * ratioHeight,
          containerLastWidth: containerWidth,
          containerLastHeight: containerHeight,
        };
      });
    },
    zonesSetTree(state, action: PayloadAction<TreeZoneEl[]>) {
      return { ...state, tree: action.payload };
    },
    zoneToggleHidden(state, action: PayloadAction<string>) {
      const zones = state.zones;
      // delete the zone and update the tree
      const zoneFound = zones.find((zone) => zone.id === action.payload);
      if (zoneFound) {
        zoneFound.hidden = !zoneFound.hidden;
      }
      // hide all children zones
      const tree = state.tree?.[0];
      if (!tree) return;
      getChildrenIdsOfTree(zoneFound?.elementId, tree).forEach((id) => {
        const zone = zones.find((zone) => zone.elementId === id);
        if (zone) {
          zone.hidden = !zone.hidden;
        }
      });
    },

    allDrawnZonesDeleted(state) {
      if (state.zones) state.zones = state.zones.filter((z) => z.createdFrom !== "user");
    },
    setIsNew(state, action: PayloadAction<boolean>) {
      state.isNew = action.payload;
    },
    zonesStoreResetInitalState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  zonesStoreResetInitalState,
  zoneAdded,
  zoneDeleted,
  zoneActiveToggled,
  zoneActivate,
  allZonesReset,
  zonesFilterByElementId,
  allDrawnZonesDeleted,
  zoneReset,
  zoneToggleHidden,
  zoneUpdated,
  zoneDuplicated,
  zonesUpdatePosition,
  zonesUpdatedByElementId,
  zonesSetTree,
  setIsNew,
} = zonesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getSelectedDrawnZoneIndex = (state: RootState) => {
  const zones = state.zonesSlice.zones.filter((z) => z.createdFrom === "user");
  const selectedZone: Zone | undefined = zones.find(
    (zone) => zone.status === ("EDITING" as ZoneStatus)
  );
  return selectedZone ? zones.indexOf(selectedZone) : -1;
};
export const getSelectedFigmaZoneIds = (state: RootState) => {
  const selectedZone: Zone | undefined = state.zonesSlice.zones
    .filter((z) => z.createdFrom === "figma")
    .find((zone) => zone.status === ("EDITING" as ZoneStatus));
  if (!selectedZone?.elementId) return [];

  // get siblings
  const parents = getParentsOfNode(
    selectedZone?.elementId,
    state.zonesSlice.tree[0]
  );
  return parents ?? [];
};
export const getUncompleteZones = (state: RootState) => {
  const uncompleteZones: Array<ZoneMissingParams> = [];
  Object.values(state.zonesSlice.zones).forEach((zone) => {
    if (
      zone?.hidden !== true &&
      (zone.zoneType === undefined ||
        zone.params === undefined ||
        !isZoneComplete(zone))
    ) {
      uncompleteZones.push({
        zoneId: zone.id,
        zoneName: zone.name,
        zoneType: zone.zoneType || "undefined",
        zoneMissingParams: getMissingZoneParams(zone),
      });
    }
  });
  return uncompleteZones;
};
export const selectZones = (state: RootState) => state.zonesSlice.zones;
export const selectZone = (state: RootState, zoneId: string) => {
  return state.zonesSlice.zones.find((zone) => zone.id === zoneId);
};

export default zonesSlice.reducer;
