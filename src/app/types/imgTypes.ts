export enum EImgFormat {
  "PNG",
  "JPG",
  "SVG",
  "OTHER",
}

export enum EImgQuality {
  "> 100ko",
  "100 - 500ko",
  "> 500ko",
}

export interface ImagesParameters {
    format: EImgFormat;
    quantity: number;
    quality: EImgQuality;
  }