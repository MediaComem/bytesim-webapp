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
  "< 480p",
  "720p",
  "1080p",
  "> 1080p (HD, 4K)",
}

/* const OVideoQuality = [
  "< 480p",
  "720p",
  "1080p",
  "> 1080p (HD, 4K)",
] as const; */

//type VideoQuality = typeof OVideoQuality[number];

// -------VIDEO Duration
//not used yet
export enum EVideoDuration {
  "< 10s" = 0,
  "10 - 30s" = 1,
  "30s - 2min" = 2,
  "2min - 5min" = 3,
  "> 5min" = 4,
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
  durationMin: EVideoDuration,
  autoplay: EBoolean,
  loop: EBoolean,
};

export interface StockVideoFormat {
  format?: keyof EVideoFormat;
  quality?: keyof EVideoQuality;
  durationMin?: keyof EVideoDuration;
  autoplay?: keyof EBoolean;
  loop?: keyof EBoolean;
}
