import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Project } from "../../app/types/types";

const initialState: Project = {
  id: 1,
  name: "Main project",
  status: "EDITING",
  params: {
    nbVisit: 1000,
    genericFont: undefined,
    infiniteScroll: undefined,
    plugins: undefined,
    server: undefined,
  },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    projectReset: (state) => {
      if (state.status !== "SIMULATION") {
        Object.assign(state, {
          params: {
            nbVisit: undefined,
            genericFont: undefined,
            inifiteScroll: undefined,
            plugins: undefined,
            server: undefined,
          },
        });
      }
    },
    projectUpdated(state, action: PayloadAction<Partial<Project>>) {
      if (
        !Object.prototype.hasOwnProperty.call(action.payload, "params") ||
        state.status !== "SIMULATION"
      ) {
        Object.assign(state, action.payload);
      }
    },
  },
});

export const { setName, projectReset, projectUpdated } = projectSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectProject = (state: RootState) => state.project;

export default projectSlice.reducer;
