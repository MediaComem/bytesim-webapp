import { isEqual, size, xorWith, isEmpty } from "lodash";

export const areArraysEqual = function (x: any[], y: any[]) {
  const isSameSize = size(x) === size(y);
  const areEqual = isSameSize && isEmpty(xorWith(x, y, isEqual));
  return areEqual;
};
