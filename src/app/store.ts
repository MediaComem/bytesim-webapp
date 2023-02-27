import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../features/project/projectSlice";
import zonesSlice from "../features/zones/zonesSlice";
import { debounce } from "debounce";
import browserStorage from "../services/browserStorage";
import recommandationsSlice from "../features/recommandations/recommandationsSlice";
import { isNewImportImage } from "../features/importImage/components/FetchedImage";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    zonesSlice,
    recommandations: recommandationsSlice,
  },
  preloadedState: isNewImportImage() ? {} : browserStorage.loadState(), // load state from local storage
});

// Subscribe to the store changes to persist to local storage
store.subscribe(
  // we use debounce to save the state once each 500ms
  // for better performances in case multiple changes occur in a short time
  debounce(() => {
    browserStorage.saveState(store.getState());
  }, 500)
);

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
