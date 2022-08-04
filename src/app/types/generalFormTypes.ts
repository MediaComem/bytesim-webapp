export enum ServerType {
    "RENEWABLE_ENERGY",
    "NON_RENEWABLE_ENERGY",
    "UNDEFINED",
  }
  export interface GeneralForm {
    nbVisit: number;
    server: ServerType;
    plugins: boolean;
    genericFont: boolean;
    inifiteScroll: boolean;
  }