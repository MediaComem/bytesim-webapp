import { EBoolean } from "./types";

export enum ServerType {
    "RENEWABLE_ENERGY",
    "NON_RENEWABLE_ENERGY",
    "UNDEFINED",
  }

  export const GeneralFormEntries = {
    nbVisit: 0,
    server: ServerType,
    plugins: EBoolean,
    genericFont: EBoolean,
    inifiteScroll: EBoolean,
  };

  export interface StockGeneralFormat {
    nbVisit?: number;
    server?: ServerType;
    plugins?: boolean;
    genericFont?: boolean;
    inifiteScroll?: boolean;
  }