// --------------- VIDEO TYPES

import { EBoolean } from "./types";

// -------VIDEO Format
//NOT USED YET
export enum EVideoFormat {
  "GIF",
  "Video",
  "Other",
}

//const OVideoFormat = ["GIF", "Video", "OTHER"];

//type VideoFormat = keyof typeof OVideoFormat;

// -------VIDEO Quality
//NOT USED YET
export enum EVideoQuality {
  RES_480_P = "< 480p",
  RES_720_P = "720p",
  RES_1080_P = "1080p",
  RES_4K = "> 1080p (HD, 4K)",
}

/* const OVideoQuality = [
  "< 480p",
  "720p",
  "1080p",
  "> 1080p (HD, 4K)",
] as const; */

//type VideoQuality = typeof OVideoQuality[number];

// -------VIDEO Duration
export enum EVideoDuration {
  DUR_10_SEC = "< 10s",
  DUR_10_30_SEC = "10 - 30s",
  DUR_30_SEC_2_MIN = "30s - 2min",
  DUR_2_5_MIN = "2min - 5min",
  DUR_5_MIN = "> 5min",
}

/* const OVideoDuration = [
  "< 10s",
  "10 - 30s",
  "30s - 2min",
  "2min - 5min",
  "> 5min",
] as const; */

//type VideoDuration = typeof OVideoDuration[number];

// GENERAL
export const VideoFormEntries = {
  format: EVideoFormat,
  quality: EVideoQuality,
  duration: EVideoDuration,
  autoplay: EBoolean,
  loop: EBoolean,
};

export interface VideoParameters {
  format?: EVideoFormat;
  quality?: EVideoQuality;
  duration?: EVideoDuration;
  autoplay?: EBoolean;
  loop?: EBoolean;
}
