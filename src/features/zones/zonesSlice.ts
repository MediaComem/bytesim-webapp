import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { TreeZoneEl, Zone, ZoneStatus } from "../../app/types/types";
import { isZoneComplete } from "../../utils/utils";
import { getChildrenIdsOfTree } from "../figma/utils";

type ZoneStore = { zones: Zone[]; tree: TreeZoneEl[] };
const initialState: ZoneStore = {
  zones: [],
  tree: [],
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
  params: undefined,
  createdFrom: "user",
};
export const defaultFigmaZone: Zone = {
  ...defaultZone,
  status: 'ACTIVE',
  createdFrom: "figma",
};

const zonesSlice = createSlice({
  name: "zones",
  initialState,
  reducers: {
    zoneAdded: {
      reducer(state, action: PayloadAction<Pick<Zone, "id">>) {
        const newPayload: Zone = {
          ...defaultZone,
          ...action.payload,
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
    allZonesReset(state) {
      return {
        ...state,
        zones: state.zones.map((z) => {
          return {
            ...z,
            zoneType: undefined,
            params: undefined,
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
    zonesUpdatedByElementId(state, action: PayloadAction<Partial<Zone>[]>) {
      action.payload?.forEach((zoneToAdd) => {
        if (zoneToAdd) updateZoneBy(state, zoneToAdd, "elementId");
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

    allZonesDeleted(state) {
      if (state.zones) state.zones.length = 0;
      if (state.tree) state.tree.length = 0;
    },
  },
});

export const {
  zoneAdded,
  zoneDeleted,
  zoneActiveToggled,
  allZonesReset,
  allZonesDeleted,
  zoneReset,
  zoneToggleHidden,
  zoneUpdated,
  zonesUpdatedByElementId,
  zonesSetTree,
} = zonesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getSelectedZoneIndex = (state: RootState) => {
  const selectedZone: Zone | undefined = state.zonesSlice.zones.find(
    (zone) => zone.status === ("EDITING" as ZoneStatus)
  );
  return selectedZone ? state.zonesSlice.zones.filter((z) => z.createdFrom === 'user').indexOf(selectedZone) : -1;
};
export const getUncompleteZones = (state: RootState) => {
  const uncompleteZones: Array<string> = [];
  Object.values(state.zonesSlice.zones).forEach((zone) => {
    if (
      zone?.hidden !== true &&
      (zone.zoneType === undefined ||
        zone.params === undefined ||
        !isZoneComplete(zone))
    ) {
      uncompleteZones.push(zone.name);
    }
  });
  return uncompleteZones;
};
export const selectZones = (state: RootState) => state.zonesSlice.zones;
export const selectZone = (state: RootState, zoneId: string) => {
  return state.zonesSlice.zones.find((zone) => zone.id === zoneId);
};

export default zonesSlice.reducer;
