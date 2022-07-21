import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Zone } from "../../app/types";

const initialState: Zone[] = [];

const defaultZone: Zone = {
  id: "0",
  name: "defaultZone",
  width: 100,
  height: 100,
  x: 100,
  y: 100,
  index: 0,
  status: "EDITING",
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
          // TO DO MANAGE INDEX
          index: 0,
        };
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
    zoneDeleted(state, action: PayloadAction<string>) {
      const existingZone = state.find((zone) => zone.id === action.payload);
      if (existingZone) {
        state.splice(state.indexOf(existingZone), 1);
      }
    },
    zoneSelected(state, action: PayloadAction<string>) {
      const existingZone = state.find((zone) => zone.id === action.payload);
      if (existingZone) {
        state.forEach((s) => {
          s.status = "ACTIVE";
        });
        existingZone.status = "EDITING";
      }
    },
  },
});

export const { zoneAdded, zoneDeleted, zoneSelected, zoneUpdated } =
  zonesSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectZones = (state: RootState) => state.zones;

export default zonesSlice.reducer;
