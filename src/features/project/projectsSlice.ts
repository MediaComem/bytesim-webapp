import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Project } from "../../app/types/types";

const initialProject: Project = {
  id: "1",
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
const initialState: Project[] = [{ ...initialProject }];

const defaultNewProject: Project = {
  id: "0",
  name: "New project",
  status: "EDITING",
  params: {
    nbVisit: 1000,
    genericFont: undefined,
    infiniteScroll: undefined,
    plugins: undefined,
    server: undefined,
  },
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    projectAdded: {
      reducer(state, action: PayloadAction<Pick<Project, "id">>) {
        const newPayload: Project = {
          ...defaultNewProject,
          ...action.payload,
          name: `New project ${state.length + 1}`,
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
    projectReset(state, action: PayloadAction<string>) {
      const projectFound = state.find(
        (project) => project.id === action.payload
      );
      if (projectFound) {
        Object.assign(projectFound, {
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
      const projectFound = state.find(
        (project) => project.id === action.payload.id
      );
      if (
        projectFound &&
        !Object.prototype.hasOwnProperty.call(action.payload, "params")
      ) {
        Object.assign(projectFound, action.payload);
      }
    },
  },
});

export const { projectReset, projectUpdated, projectAdded } =
  projectsSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectProjects = (state: RootState) => state.projects;

export default projectsSlice.reducer;
