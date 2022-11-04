import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Zone, ZoneStatus } from "../../app/types/types";

const initialState: Zone[] = [];

const defaultZone: Zone = {
  id: "0",
  name: "defaultZone",
  width: 100,
  height: 100,
  x: 100,
  y: 100,
  status: "EDITING",
  zoneType: undefined,
  params: undefined,
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
          name: `Zone ${state.length + 1}`,
        };
        state.forEach(zone => { zone.status = "ACTIVE" });
        state.push(newPayload);
      },
      prepare() {
        return {
          payload: {
            id: nanoid(),
          },
        };
      },
    },
    zoneUpdated(
      state,
      action: PayloadAction<Partial<Zone> & Pick<Zone, "id">>
    ) {
      const existingZone = state.find((zone) => zone.id === action.payload.id);
      if (existingZone) {
        Object.assign(existingZone, action.payload);
      }
    },
    zoneReset(state, action: PayloadAction<string>) {
      const existingZone = state.find((zone) => zone.id === action.payload);
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
      const existingZone = state.find((zone) => zone.id === action.payload);
      if (existingZone) {
        state.splice(state.indexOf(existingZone), 1);
      }
    },
    zoneActiveToggled(state, action: PayloadAction<string>) {
      const existingZone = state.find((zone) => zone.id === action.payload);
      if (existingZone) {
        if (existingZone?.status === "EDITING") {
         existingZone.status = "ACTIVE";
         return;
        }
        state.forEach((s) => {
          s.status = "ACTIVE";
        });
        existingZone.status = "EDITING";
      }
    },
    allZonesReset(state) {
      state.forEach((z) => {
        z.params = undefined;
        z.zoneType = undefined;
      });
    },
    allZonesDeleted(state) {
      state.length = 0;
    },
  },
});

export const {
  zoneAdded,
  zoneDeleted,
  zoneActiveToggled,
  zoneUpdated,
  zoneReset,
  allZonesReset,
  allZonesDeleted,
} = zonesSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const getSelectedZoneIndex = (state: RootState) => {
      const selectedZone: Zone | undefined = state.zones.find((zone) => zone.status === "EDITING" as ZoneStatus);
      return selectedZone ? state.zones.indexOf(selectedZone) : -1;
};
export const selectZones = (state: RootState) => state.zones;
export const selectZone = (state: RootState, zoneId: string) => {
  return state.zones.find((zone) => zone.id === zoneId);
};

export default zonesSlice.reducer;
