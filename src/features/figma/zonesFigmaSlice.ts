import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ZoneFigma, FigmaTreeEl } from "../../app/types/types";

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

const defaultZone: ZoneFigma = {
  id: "0",
  elementId: "0",
  name: "defaultZone",

  zoneType: undefined,
  params: undefined,
  createdFrom: "figma",
};

const zonesSlice = createSlice({
  name: "zones",
  initialState,
  reducers: {
    zoneFigmaUpdated(state, action: PayloadAction<ZoneFigma>) {
      const zoneFound = state.zones.find(
        (zone) => zone.id === action.payload?.id
      );
      const existingZone = zoneFound ?? {
        ...defaultZone,
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
    zonesFigmaSetTree(state, action: PayloadAction<FigmaTreeEl[]>) {
      return { ...state, tree: action.payload };
    },

    allZonesDeleted(state) {
      if (state.zones) state.zones.length = 0;
      if (state.tree) state.tree.length = 0;
    },
  },
});

export const {
  zoneFigmaUpdated,
  zonesFigmaUpdated,
  zonesFigmaSetTree,
  allZonesDeleted,
} = zonesSlice.actions;

export default zonesSlice.reducer;
