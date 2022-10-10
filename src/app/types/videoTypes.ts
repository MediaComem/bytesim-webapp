import { EBoolean } from "./types";

// -------VIDEO Format
export enum EVideoFormat {
  FORMAT_VIDEO = "Video",
  FORMAT_GIF = "GIF",
  FORMAT_OTHER = "Other",
}

export enum EVideoQuality {
  RES_480_P = "< 480p",
  RES_720_P = "720p",
  RES_1080_P = "1080p",
  RES_4K = "> 1080p (HD, 4K)",
}

export enum EVideoDuration {
  DUR_10_SEC = "< 10s",
  DUR_10_30_SEC = "10 - 30s",
  DUR_30_SEC_2_MIN = "30s - 2min",
  DUR_2_5_MIN = "2min - 5min",
  DUR_5_MIN = "> 5min",
}

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
