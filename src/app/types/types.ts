
import { GenericParameters } from "./generalFormTypes";

import { ImagesParameters } from "./imgTypes";
import { VideoParameters } from "./videoTypes";

export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  params: GenericParameters;
}

export interface User {
  id: string;
  status: UserStatus;
  connexionToken: string;
}

export interface ZoneInfo {
  id: string;
  name: string;
  index?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  status: ZoneStatus;
}

export interface ZoneUnknown extends ZoneInfo {
  zoneType?: undefined;
  params?: undefined;
}

export interface ZoneVideo extends ZoneInfo {
  zoneType: ZoneType.Video;
  params?: VideoParameters;
}

export interface ZoneImages extends ZoneInfo {
  zoneType: ZoneType.Imgs;
  params?: ImagesParameters;
}

export interface ZoneText extends ZoneInfo {
  zoneType: ZoneType.Text;
  params?: any
}

export interface ZoneDynamic extends ZoneInfo {
  zoneType: ZoneType.DynContent;
  params?: any
}

export type Zone = ZoneUnknown | ZoneVideo | ZoneImages | ZoneText | ZoneDynamic;

export type ProjectStatus = "EDITING" | "SIMULATION" | "LOADING";
export type ZoneStatus = "EDITING" | "ACTIVE" | "LOADING";
export type UserStatus = "CONNECTED" | "AFK" | "LOADING";

export enum ZoneType {
  Video = "Video",
  Imgs = "Images",
  Text = "Text",
  DynContent = "Dynamic content",
}

export type FormsType = ZoneParamsType | GenericParameters;
export type ZoneParamsType = VideoParameters | ImagesParameters;

export enum EBoolean {
  YES = "Yes",
  NO = "No",
}

// not complete form zone + general
// front des reco (components)
// Reco dans le store
// Modele de calcul -> video pour le POC, 1 par type
// Modele de reco
//Zone View à adapter pour différents formats d'image svg de base
// création de PDF