import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Recommandation } from "../../app/types/recommandations";
import { FormsType } from "../../app/types/types";

const initialState: Recommandation<FormsType[keyof FormsType]>[] = [];

const recommandationsSlice = createSlice({
  name: "recommandations",
  initialState,
  reducers: {
    /* recommandationsReset: (state) => {
      //state = undefined;
    }, */
    recommandationUpdated(
      state,
      action: PayloadAction<Partial<Recommandation<FormsType[keyof FormsType]>> & Pick<Recommandation<FormsType[keyof FormsType]>, "id">>
    ) {
      const existingReco = state.find((reco) => reco.id === action.payload.id);
      if (existingReco) {
        Object.assign(existingReco, action.payload);
      }
    },
  },
});

export const { recommandationUpdated } = recommandationsSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectRecommandations = (state: RootState) => state.project;

export default recommandationsSlice.reducer;
