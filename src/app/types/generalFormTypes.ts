import { EBoolean } from "./types";

export enum ServerType {
    "Renewable energy",
    "Non renewable energy",
    "Do not know",
  }

  export const GeneralFormEntries = {
    nbVisit: 0,
    server: ServerType,
    plugins: EBoolean,
    genericFont: EBoolean,
    inifiteScroll: EBoolean,
  };

  export interface GenericParameters {
    nbVisit?: number;
    server?: ServerType;
    plugins?: boolean;
    genericFont?: boolean;
    inifiteScroll?: boolean;
  }