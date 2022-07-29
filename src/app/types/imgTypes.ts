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

export interface ImgForm {
    format: ImgFormat;
    quantity: number;
    quality: ImgQuality;
  }