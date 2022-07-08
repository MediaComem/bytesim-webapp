import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ProjectState } from "../../app/types";

const initialState: ProjectState = {
  id: 1,
  name: "test project",
  status: "LOADING",
  zones: []
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    }
  }
});

export const { setName } = projectSlice.actions
// Other code such as selectors can use the imported `RootState` type
export const selectProject = (state: RootState) => state.project

export default projectSlice.reducer;