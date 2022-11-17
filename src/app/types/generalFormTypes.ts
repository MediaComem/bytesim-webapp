import { EBoolean } from "./types";

export enum ServerType {
  RENEWABLE = "Renewable energy",
  NON_RENEWABLE = "Non renewable energy",
  UNKNOWN = "Do not know",
}

export const GeneralFormEntries = {
  nbVisit: 1000,
  server: ServerType,
  plugins: EBoolean,
  genericFont: EBoolean,
  infiniteScroll: EBoolean,
};

export const getGeneralEntryLabel = (entry: string) => {
  switch (entry) {
    case "nbVisit":
      return "Estimated visits / Month";
    case "server":
      return "Server";
    case "plugins":
      return "Plugins";
    case "genericFont":
      return "Generic fonts";
    case "infiniteScroll":
      return "Infinite scroll";
    default:
      return entry;
  }
};

export interface GenericParameters {
  nbVisit?: number;
  server?: ServerType;
  plugins?: boolean;
  genericFont?: boolean;
  infiniteScroll?: boolean;
}
