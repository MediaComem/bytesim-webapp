export enum EImgFormat {
  "PNG",
  "JPG",
  "SVG",
  "Other",
}

export enum EImgQuality {
  "> 100ko",
  "100 - 500ko",
  "> 500ko",
}

export const ImageFormEntries: {[key: string]: any} = {
    format: EImgFormat,
    quantity: 1,
    quality: EImgQuality
};

export interface ImageParameters {
    format: EImgFormat;
    quantity: number;
    quality: EImgQuality;
  }