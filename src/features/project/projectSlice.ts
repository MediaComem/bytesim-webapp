import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Project, ProjectStatus } from "../../app/types/types";

const initialState: Project = {
  id: 1,
  name: "Main project",
  status: "EDITING",
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    projectReset: (state) => {
      state.params = undefined;
    },
    projectUpdated(state, action: PayloadAction<Partial<Project>>) {
      Object.assign(state, action.payload);
    },
    projectStateUpdate(state, action: PayloadAction<Partial<ProjectStatus>>) {
      state.status = action.payload;
    },
  },
});

export const { setName, projectReset, projectUpdated, projectStateUpdate } =
  projectSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectProject = (state: RootState) => state.project;

export default projectSlice.reducer;
