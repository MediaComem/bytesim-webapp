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

/* export function PrettyZoneTypes(type: ZoneType) {
  switch (type as ZoneType) {
    case 'Video':
      return "Video";
    case "Imgs":
      return "Images";
    case "Text":
      return "Text";
    case "DynContent":
      return "Search";
  }
}*/

// Formulaires general + zone
// not complete form zone + general
// store in localstorage -> lib?
// front des reco (components)
// Reco dans le store
// Modele de calcul -> video pour le POC, 1 par type
// Modele de reco
//Zone View à adapter pour différents formats d'image svg de base
// création de PDF

export enum ImgFormat {
  "PNG",
  "JPG",
  "SVG",
  "OTHER",
}

export enum ImgQuality {
  "> 100ko",
  "100 - 500ko",
  "> 500ko",
}

// --------------- VIDEO
// -------VIDEO Format
//NOT USED YET
export enum EVideoFormat {
  "GIF",
  "Video",
  "OTHER",
}

export const OVideoFormat = [
  "GIF",
  "Video",
  "OTHER",
 ] as const;

type VideoFormat = typeof OVideoFormat[number];

// -------VIDEO Quality
//NOT USED YET
export enum EVideoQuality {
  "< 480p",
  "720p",
  "1080p",
  "> 1080p (HD, 4K)",
}

export const OVideoQuality = [
  "< 480p",
  "720p",
  "1080p",
  "> 1080p (HD, 4K)",
] as const;

type VideoQuality = typeof OVideoQuality[number];

// -------VIDEO Duration
//not used yet
export enum EVideoDuration {
  "< 10s",
  "10 - 30s",
  "30s - 2min",
  "2min - 5min",
  "> 5min",
}

export const OVideoDuration = [
  "< 10s",
  "10 - 30s",
  "30s - 2min",
  "2min - 5min",
  "> 5min",
] as const;

type VideoDuration = typeof OVideoDuration[number];

export enum ServerType {
  "RENEWABLE_ENERGY",
  "NON_RENEWABLE_ENERGY",
  "UNDEFINED",
}

export enum Boolean {
  "Yes" = 1,
  "No" = 0,
}

export const OBoolean = [
  "Yes",
  "No",
]

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

/* export interface StockImgFormat {
  format: VideoFormat;
  quantity: number;
  quality: VideoQuality;
}
 */
export const VideoFormEntries = {
  format: OVideoFormat,
  quality: OVideoQuality,
  durationMin: OVideoDuration,
  autoplay: Boolean,
  loop: Boolean,
}

export interface StockVideoFormat {
  format: VideoFormat;
  quality: VideoQuality;
  durationMin: VideoDuration;
  autoplay: Boolean;
  loop: Boolean;
}
// + StockImgFormat
export type ZoneParamsType = StockVideoFormat;

export function getZoneFormEntries(zoneType?: ZoneType) {
  switch (zoneType) {
    case "Video":
      return VideoFormEntries;
    default:
      return undefined;
  }
}
