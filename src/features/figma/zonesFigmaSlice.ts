import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ZoneFigma } from "../../app/types/types";
import { TreeEl } from "./components/remoteSvg";

type ZoneFigmaStore = { zones: ZoneFigma[]; tree: TreeEl[] };

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
// type ZoneTree = {
//   zone?: ZoneTree;
//   children?: ZoneTree[];
// };
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
    // zoneAdded: {
    //   reducer(state, action: PayloadAction<Pick<ZoneFigma, "id">>) {
    //     const newPayload: ZoneFigma = {
    //       ...defaultZone,
    //       ...action.payload,
    //       name: `ZoneFigma ${state.length + 1}`,
    //       // TO DO MANAGE INDEX
    //       index: 0,
    //     };
    //     state.push(newPayload);
    //   },
    //   prepare() {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //       },
    //     };
    //   },
    // },
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
    zonesFigmaSetTree(state, action: PayloadAction<TreeEl[]>) {
      // return { ...state, tree: action.payload };
    },
    // zoneUpdated(
    //   state,
    //   action: PayloadAction<ZoneFigma & Pick<ZoneFigma, "id">>
    // ) {
    //   const existingZone = state.find((zone) => zone.id === action.payload.id);
    //   if (existingZone) {
    //     Object.assign(existingZone, action.payload);
    //   }
    // },
    // zoneReset(state, action: PayloadAction<string>) {
    //   const existingZone = state.find((zone) => zone.id === action.payload);
    //   if (existingZone) {
    //     const resetParams = {
    //       id: existingZone.id,
    //       params: undefined,
    //       zoneType: undefined,
    //     };
    //     Object.assign(existingZone, resetParams);
    //   }
    // },
    // zoneDeleted(state, action: PayloadAction<string>) {
    //   const existingZone = state.find((zone) => zone.id === action.payload);
    //   if (existingZone) {
    //     state.splice(state.indexOf(existingZone), 1);
    //   }
    // },
    // zoneSelected(state, action: PayloadAction<string>) {
    //   const existingZone = state.find((zone) => zone.id === action.payload);
    //   if (existingZone) {
    //     state.forEach((s) => {
    //       s.status = "ACTIVE";
    //     });
    //     existingZone.status = "EDITING";
    //   }
    // },
    // allZonesReset(state) {
    //   state.forEach((z) => {
    //     z.params = undefined;
    //     z.zoneType = undefined;
    //   });
    // },
    allZonesDeleted(state) {
      if (state.zones) state.zones.length = 0;
      if (state.tree) state.tree.length = 0;
    },
  },
});

export const {
  // zoneAdded,
  // zoneDeleted,
  // zoneSelected,
  // zoneUpdated,
  zoneFigmaUpdated,
  zonesFigmaUpdated,
  zonesFigmaSetTree,
  // zoneReset,
  // allZonesReset,
  allZonesDeleted,
} = zonesSlice.actions;
// Other code such as selectors can use the imported `RootState` type
// export const selectZones = (state: RootState) => state.zones;
// export const selectZone = (state: RootState, zoneId: string) => {
//   return state.zones.find((zone) => zone.id === zoneId);
// };

export default zonesSlice.reducer;
