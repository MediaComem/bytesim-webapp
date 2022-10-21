export interface DynContentParameters {
  content?: EDynContent;
}

export enum EDynContent {
  DYN_CONT_SEARCH = "Search",
  DYN_CONT_DYNAMIC_MAP = "Dynamic Map",
  DYN_CONT_ADVERTISING = "Advertising",
  DYN_CONT_SOCIAL_NETWORK = "Social network",
  DYN_CONT_CONTENT_BOX = "Recommandations",
  DYN_CONT_3D = "3D",
  DYN_CONT_PDF_DOWNLOAD = "PDF download",
  DYN_CONT_FORM = "Form"
}

export const DynContentFormEntries = {
  content: EDynContent,
};