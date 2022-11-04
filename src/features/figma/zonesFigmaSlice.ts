import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ZoneFigma, FigmaTreeEl } from "../../app/types/types";
import { getChildrenIdsOfTree, removeSubTree } from "./utils";

type ZoneFigmaStore = { zones: ZoneFigma[]; tree: FigmaTreeEl[] };

const updateZone = (state: ZoneFigmaStore, zoneToAdd: Partial<ZoneFigma>) => {
  const zoneFound = state?.zones?.find((zone) => zone.id === zoneToAdd?.id);
  const existingZone = zoneFound ?? {
    ...zoneToAdd,
    id: nanoid(),
  };
  if (zoneFound) {
    return Object.assign(existingZone, zoneToAdd);
  }
  if (!state.zones) state.zones = [];
  state?.zones.push(existingZone as ZoneFigma);
};

const initialState: ZoneFigmaStore = {
  zones: [],
  tree: [],
};

export const defaultFigmaZone: ZoneFigma = {
  id: "0",
  elementId: "0",
  name: "defaultZone",
  width: 100,
  height: 100,
  x: 100,
  y: 100,
  status: "EDITING",
  zoneType: undefined,
  params: undefined,
  createdFrom: "figma",
};

const zonesSlice = createSlice({
  name: "zones",
  initialState,
  reducers: {
    zoneFigmaUpdated(state, action: PayloadAction<Partial<ZoneFigma>>) {
      const zoneFound = state.zones.find(
        (zone) => zone.id === action.payload?.id
      );
      const existingZone = zoneFound ?? {
        ...defaultFigmaZone,
        ...action.payload,
        id: nanoid(),
      };

      Object.assign(existingZone, action.payload);
      updateZone(state, action.payload);
    },
    zonesFigmaUpdated(state, action: PayloadAction<Partial<ZoneFigma>[]>) {
      action.payload?.forEach((zoneToAdd) => {
        if (zoneToAdd) updateZone(state, zoneToAdd);
      });
    },
    zoneFigmaReset(state, action: PayloadAction<string>) {
      const zoneFound = state.zones.find((zone) => zone.id === action.payload);
      if (zoneFound) {
        const resetParams = {
          id: zoneFound.id,
          params: undefined,
          zoneType: undefined,
        };
        Object.assign(zoneFound, resetParams);
      }
    },
    zonesFigmaSetTree(state, action: PayloadAction<FigmaTreeEl[]>) {
      return { ...state, tree: action.payload };
    },
    zoneFigmaToggleHidden(state, action: PayloadAction<string>) {
      const zones = state.zones;
      // delete the zone and update the tree
      const zoneFound = zones.find((zone) => zone.id === action.payload);
      if (zoneFound) {
        zoneFound.hidden = !zoneFound.hidden;
      }
    },

    allZonesFigmaDeleted(state) {
      if (state.zones) state.zones.length = 0;
      if (state.tree) state.tree.length = 0;
    },
  },
});

export const {
  zoneFigmaReset,
  zoneFigmaToggleHidden,
  zoneFigmaUpdated,
  zonesFigmaUpdated,
  zonesFigmaSetTree,
  allZonesFigmaDeleted,
} = zonesSlice.actions;

export default zonesSlice.reducer;
