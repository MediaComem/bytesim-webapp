import { DynContentFormEntries } from "../app/types/dynContentTypes";
import { ImageFormEntries } from "../app/types/imgTypes";
import { Zone, ZoneType } from "../app/types/types";
import { VideoFormEntries } from "../app/types/videoTypes";

export const getTypeEntries = (typeOfZone: ZoneType) => {
  switch (typeOfZone) {
    case ZoneType.Video:
      return VideoFormEntries;
    case ZoneType.Images:
      return ImageFormEntries;
    case ZoneType.DynamicContent:
      return DynContentFormEntries;
    default:
      return DynContentFormEntries;
  }
};

// Check if the provided zone has every params filled
export const isZoneComplete = (zone: Zone) => {
  if (zone.params && zone.zoneType) {
    return (
      Object.keys(zone.params).length ===
      Object.keys(getTypeEntries(zone.zoneType)).length
    );
  } else {
    return false;
  }
};
