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
  width: string;
  height: string;
  zoneType?: ZoneType;
  status: ZoneStatus;
}
export type ZoneType = "VIDEO" | "IMG" | "TEXT" | "SEARCH" | "DYNAMIC_MAP" | "ADS" | "SOCIAL_NETWORK" | "OTHER_DYN_CONTENT" | "3D";
export type ProjectStatus = "EDITING" | "SIMULATION" | "LOADING";
export type ZoneStatus = "EDITING" | "ACTIVE" | "LOADING";
export type UserStatus = "CONNECTED" | "AFK" | "LOADING";

export type ImgFormat = "PNG" | "JPG" | "SVG" | "OTHER";
export type VideoFormat = "MP4" | "AVI" | "MKV" | "MOV" | "OTHER";
export type ImgQuality = "> 100ko" | "100 - 500ko" | "> 500ko";
export type VideoQuality = "> 300ko" | "300 - 900ko" | "> 900ko";
export type ServerType = "RENEWABLE_ENERGY" | "NON_RENEWABLE_ENERGY" | "UNDEFINED";

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