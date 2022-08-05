import { EBoolean } from "./types";

// -------VIDEO Format
export enum EVideoFormat {
  "GIF",
  "Video",
  "Other",
}

export enum EVideoQuality {
  "< 480p",
  "720p",
  "1080p",
  "> 1080p (HD, 4K)",
}

export enum EVideoDuration {
  "< 10s" = 0,
  "10 - 30s" = 1,
  "30s - 2min" = 2,
  "2min - 5min" = 3,
  "> 5min" = 4,
}

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
