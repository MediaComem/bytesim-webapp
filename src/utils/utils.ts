import { DynContentFormEntries } from "../app/types/dynContentTypes";
import { ImageFormEntries } from "../app/types/imgTypes";
import { ZoneType } from "../app/types/types";
import { VideoFormEntries } from "../app/types/videoTypes";

export const getTypeEntries = (typeOfZone: ZoneType) => {
    switch (typeOfZone) {
      case ZoneType.Video:
        return VideoFormEntries;
      case ZoneType.Images:
        return ImageFormEntries;
      case ZoneType.DynamicContent:
        return DynContentFormEntries;
    }
};