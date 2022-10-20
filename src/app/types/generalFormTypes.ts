import { EBoolean } from "./types";

export enum ServerType {
  RENEWABLE = "Renewable energy",
  NON_RENEWABLE = "Non renewable energy",
  UNKNOWN = "Do not know",
}

export const GeneralFormEntries = {
  nbVisit: 0,
  server: ServerType,
  plugins: EBoolean,
  genericFont: EBoolean,
  inifiteScroll: EBoolean,
};

export const getGeneralEntryLabel = (entry: string) => {
  switch (entry) {
    case "nbVisit":
      return "number of visits/month";
    default:
      return entry;
  }
};

export interface GenericParameters {
  nbVisit?: number;
  server?: ServerType;
  plugins?: boolean;
  genericFont?: boolean;
  inifiteScroll?: boolean;
}
