import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Recommandation, RecommandationWithZone } from "../../app/types/recommandations";
import { FormsType } from "../../app/types/types";
import { VideoParameters } from "../../app/types/videoTypes";

const initialState: RecommandationWithZone<VideoParameters[keyof VideoParameters]>[] = [];

const recommandationsSlice = createSlice({
  name: "recommandations",
  initialState,
  reducers: {
    recommandationAdded(state, action: PayloadAction<RecommandationWithZone<VideoParameters[keyof VideoParameters]>>) {
      state.push(action.payload);
    },
    recommandationsPopulated(state, action: PayloadAction<RecommandationWithZone<VideoParameters[keyof VideoParameters]>[]>) {
      state.length = 0;
      action.payload.forEach((r) => {
        state.push(r);
      })
    },
    recommandationsReset: (state) => {
      state.length = 0;
    },
    recommandationUpdated(
      state,
      action: PayloadAction<Partial<RecommandationWithZone<FormsType[keyof FormsType]>> & Pick<Recommandation<FormsType[keyof FormsType]>, "id">>
    ) {
      const existingReco = state.find((reco) => reco.id === action.payload.id);
      if (existingReco) {
        Object.assign(existingReco, action.payload);
      }
    },
  },
});

export const { recommandationUpdated, recommandationsPopulated, recommandationAdded, recommandationsReset } = recommandationsSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectRecommandations = (state: RootState) => state.project;

export default recommandationsSlice.reducer;
