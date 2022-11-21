export enum EImgFormat {
  FORMAT_WEBP = "WebP",
  FORMAT_PNG = "PNG",
  FORMAT_GIF = "JPG",
  FORMAT_SVG = "SVG",
  FORMAT_Other = "Other",
}

export enum EImgSize {
  SIZE_100KO = "< 100ko",
  SIZE_100_500KO = "100 - 500ko",
  SIZE_MORE_500KO = "> 500ko",
}

export const ImageFormEntries: {[key: string]: any} = {
    format: EImgFormat,
    quantity: 1,
    size: EImgSize
};

export interface ImageParameters {
    format: EImgFormat;
    quantity: number;
    size: EImgSize;
  }