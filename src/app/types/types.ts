import { GenericParameters } from "./generalFormTypes";

import { ImageParameters } from "./imgTypes";
import { VideoParameters } from "./videoTypes";
import { DynContentParameters } from "./dynContentTypes";

export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  params: GenericParameters;
  screenshotBlob?: string;
}

export interface User {
  id: string;
  status: UserStatus;
  connexionToken: string;
}

export interface ZoneInfo {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: ZoneStatus;
  createdFrom?: "user" | "figma";
  // only for figma fields
  hidden?: boolean;
  elementId?: string;
  initWidth?: number;
  initHeight?: number;
  initX?: number;
  initY?: number;
}

export interface ZoneUnknown extends ZoneInfo {
  zoneType?: undefined;
  params?: undefined | {};
}

export interface ZoneVideo extends ZoneInfo {
  zoneType: ZoneType.Video;
  params?: VideoParameters | {};
}

export interface ZoneImages extends ZoneInfo {
  zoneType: ZoneType.Images;
  params?: ImageParameters | {};
}

export interface ZoneDynamic extends ZoneInfo {
  zoneType: ZoneType.DynamicContent;
  params?: any | {};
}

export type Zone =
  | ZoneUnknown
  | ZoneVideo
  | ZoneImages
  | ZoneDynamic;

export type ZoneFigma = Omit<Zone, "createdFrom"> & {
  id: string;
  createdFrom: "figma";
  elementId: string;
  hidden?: boolean;
};
export type TreeZoneEl = {
  id: string;
  children?: TreeZoneEl[];
};

export type ProjectStatus = "EDITING" | "SIMULATION" | "LOADING";
export type ZoneStatus = "EDITING" | "ACTIVE" | "LOADING";
export type UserStatus = "CONNECTED" | "AFK" | "LOADING";

export enum ZoneType {
  Video = "Video",
  Images = "Images",
  DynamicContent = "DynamicContent",
}

export type FormsType = ZoneParamsType | GenericParameters;
export type ZoneParamsType =
  | VideoParameters
  | ImageParameters
  | DynContentParameters;

export enum EBoolean {
  NO = "No",
  YES = "Yes",
}

// not complete form zone + general
// front des reco (components)
// Reco dans le store
// Modele de calcul -> video pour le POC, 1 par type
// Modele de reco
// Zone View à adapter pour différents formats d'image svg de base
// création de PDF
