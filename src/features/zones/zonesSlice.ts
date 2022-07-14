import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Zone } from "../../app/types";

const initialState: Zone[] = [];

const zonesSlice = createSlice({
  name: "zones",
  initialState,
  reducers: {
    zoneAdded(state, action: PayloadAction<Zone>) {
      state.push(action.payload);
    },
    // not working yet WIP
    zoneDeleted(state, action: PayloadAction<string>) {
      const existingZone = state.find((zone) => zone.id === action.payload);
      if (existingZone) {
        console.log('hola');
        state = state.filter(z => z.id === action.payload);
      }
    },
    zonePosUpdated(state, action: PayloadAction<{ id: string; x: number; y: number }>) {
      const { id, x, y } = action.payload;
      const existingZone = state.find((zone) => zone.id === id);
      if (existingZone) {
        existingZone.x = x;
        existingZone.y = y;
      }
    },
    zoneSizeUpdated(
      state,
      action: PayloadAction<{ id: string; width: string; height: string }>
    ) {
      const { id, width, height } = action.payload;
      const existingZone = state.find((zone) => zone.id === id);
      if (existingZone) {
        existingZone.width = width;
        existingZone.height = height;
      }
    },
    zoneNameUpdated(
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) {
      const { id, name } = action.payload;
      const existingZone = state.find((zone) => zone.id === id);
      if (existingZone) {
        existingZone.name = name;
      }
    },
    zoneSelected(state, action: PayloadAction<string>) {
      const existingZone = state.find((zone) => zone.id === action.payload);
      if (existingZone) {
        state.forEach((s) => { s.status = "ACTIVE" });
        existingZone.status = "EDITING";
      }
    },
  },
});

export const { zoneAdded, zoneDeleted, zonePosUpdated, zoneSizeUpdated, zoneNameUpdated, zoneSelected } = zonesSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectZones = (state: RootState) => state.zones;

export default zonesSlice.reducer;
