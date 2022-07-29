import { StockVideoFormat } from "./videoTypes";

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
  params?: ZoneParamsType;
}

export type ProjectStatus = "EDITING" | "SIMULATION" | "LOADING";
export type ZoneStatus = "EDITING" | "ACTIVE" | "LOADING";
export type UserStatus = "CONNECTED" | "AFK" | "LOADING";

export enum ZoneType {
  Video = "Video",
  Imgs = "Images",
  Text = "Text",
  DynContent = "Dynamic content",
}

export type ZoneParamsType = StockVideoFormat // | ImgFormat | TextFormat

export enum EBoolean {
  "Yes" = 1,
  "No" = 0,
}

// Formulaires general
// not complete form zone + general
// store in localstorage -> lib?
// front des reco (components)
// Reco dans le store
// Modele de calcul -> video pour le POC, 1 par type
// Modele de reco
//Zone View à adapter pour différents formats d'image svg de base
// création de PDF