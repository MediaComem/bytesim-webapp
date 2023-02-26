import { isEqual } from "lodash";
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

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const getMissingZoneParams = (zone: Zone): string[] => {
  if (zone.params && zone.zoneType) {
    const zoneTypeEntries = Object.keys(getTypeEntries(zone.zoneType));
    const zoneEntriesInParams = Object.keys(zone.params);
    return zoneTypeEntries.filter(
      (value) => !zoneEntriesInParams.includes(value)
    );
  }
  return [];
};

export const isEqualDebug = (a: any, b: any) => {
  const isEq = isEqual(a, b);
  console.log("isEqual", isEq, a, b);
  return isEq;
};
