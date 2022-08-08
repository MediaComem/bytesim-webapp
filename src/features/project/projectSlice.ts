import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Project } from "../../app/types/types";

// const nbZones = useAppSelector((state) => state.project.zones.length);

const initialState: Project = {
  id: 1,
  name: "Main project",
  status: "LOADING",
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
