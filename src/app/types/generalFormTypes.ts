import { EBoolean } from "./types";

export enum EServerType {
  RENEWABLE = "Renewable energy",
  NON_RENEWABLE = "Non renewable energy",
  UNKNOWN = "Do not know",
}

export const GeneralFormEntries = {
  nbVisit: 1000,
  server: EServerType,
  plugins: EBoolean,
  customFonts: EBoolean,
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
    case "customFonts":
      return "Custom fonts";
    case "infiniteScroll":
      return "Infinite scroll";
    default:
      return entry;
  }
};

export interface GenericParameters {
  nbVisit?: number;
  server?: EServerType;
  plugins?: boolean;
  genericFont?: boolean;
  infiniteScroll?: boolean;
}
