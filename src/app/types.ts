export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
}
export interface User {
  id: string;
  status: UserStatus;
  connexionToken: string;
}

export interface Zone {
  id: string;
  name: string;
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  zoneType?: ZoneType;
  status: ZoneStatus;
}

export type ProjectStatus = "EDITING" | "SIMULATION" | "LOADING";
export type ZoneStatus = "EDITING" | "ACTIVE" | "LOADING";
export type UserStatus = "CONNECTED" | "AFK" | "LOADING";

export const zoneTypes = [
  "VIDEO",
  "IMGS",
  "TXT",
  "SEARCH",
  "DYN_MAP",
  "ADS",
  "SOCIAL_NETWORK",
  "3D",
  "OTHER_DYN_CONTENT",
] as const;
export type ZoneType = typeof zoneTypes[number];
export function PrettyZoneTypes(type: ZoneType) {
  switch (type) {
    case "VIDEO":
      return "Video";
    case "IMGS":
      return "Images";
    case "TXT":
      return "Text";
    case "SEARCH":
      return "Search";
    case "DYN_MAP":
      return "Dynamic map";
    case "ADS":
      return "Advertisment";
    case "SOCIAL_NETWORK":
      return "Social network";
    case "3D":
      return "3D element";
    case "OTHER_DYN_CONTENT":
      return "Other dynamic content";
  }
}

export const imgFormats = ["PNG", "JPG", "SVG", "OTHER"] as const;
export type ImgFormat = typeof imgFormats[number];
export const videoFormats = ["MP4", "AVI", "MKV", "MOV", "OTHER"] as const;
export type VideoFormat = typeof videoFormats[number];
export const imgQualities = ["> 100ko", "100 - 500ko", "> 500ko"] as const;
export type ImgQuality = typeof imgQualities[number];
export const videoQualities = ["> 300ko", "300 - 900ko", "> 900ko"] as const;
export type VideoQuality = typeof videoQualities[number];
export const serverTypes = [
  "RENEWABLE_ENERGY",
  "NON_RENEWABLE_ENERGY",
  "UNDEFINED",
] as const;
export type ServerType = typeof serverTypes[number];

export interface GeneralForm {
  nbVisit: number;
  server: ServerType;
  plugins: boolean;
  genericFont: boolean;
  inifiteScroll: boolean;
}

export interface ImgForm {
  format: ImgFormat;
  quantity: number;
  quality: ImgQuality;
}

export interface VideoForm {
  format: VideoFormat;
  autoplay: boolean;
  durationMin: number;
  quality: VideoQuality;
}
export function getZoneTypeForm(type: ZoneType) {
  switch (type) {
    case "VIDEO":
      return "Video";
    case "IMGS":
      return "Images";
    case "TXT":
      return "Text";
    case "SEARCH":
      return "Search";
    case "DYN_MAP":
      return "Dynamic map";
    case "ADS":
      return "Advertisment";
    case "SOCIAL_NETWORK":
      return "Social network";
    case "3D":
      return "3D element";
    case "OTHER_DYN_CONTENT":
      return "Other dynamic content";
  }
}