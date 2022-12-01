export interface DynContentParameters {
  content?: EDynContent;
}

export enum EDynContent {
  DYN_CONT_DYNAMIC_MAP = "Dynamic Map",
  DYN_CONT_ADVERTISING = "Advertising",
  DYN_CONT_ANYLYTICS = "Analytics",
}

export const DynContentFormEntries: {[key: string]: any} = {
  content: EDynContent,
};