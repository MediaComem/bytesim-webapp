import React, { memo, useEffect } from "react";
import SVG from "react-inlinesvg";
import { useDispatch } from "react-redux";

import {
  getRelativePosition,
  getTreeHierarchyFromDOM,
  hashCode,
  registerHoverEventsOnFigmaEls,
  REMOTE_PARENT_SVG_ID,
} from "../utils";
import { colorTheme } from "../../../theme";
import {
  defaultFigmaZone,
  zonesSetTree,
  zonesUpdatedByElementId,
} from "../../zones/zonesSlice";

export const getSvgUrlFromCurrentUrl = () => {
  // get current url
  const url = window.location.href;
  // find in the url bytesimBucket, region and key
  const bytesimBucket = url.match(/bytesimBucket=([^&]*)/)?.[1];
  const region = url.match(/region=([^&]*)/)?.[1];
  const key = url.match(/key=([^&]*)/)?.[1];

  // if some of the object are not defined return the default test url
  const defaultUrl =
    "https://bytesim-bucket.s3.eu-west-3.amazonaws.com/1350067722696166.5_bytesimname_bytesim_dev___Page_1.svg";
  if (!bytesimBucket || !region || !key) return defaultUrl;

  // the url is formed like this https://bucket-name.s3.Region.amazonaws.com/key-name
  return `https://${bytesimBucket}.s3.${region}.amazonaws.com/${key}`;
};
const defaultFigmaZoneWithoutId = { ...defaultFigmaZone };
//@ts-ignore
delete defaultFigmaZoneWithoutId["id"];

const FetchedSVG = ({
  url = getSvgUrlFromCurrentUrl(), // "https://bytesim-bucket.s3.eu-west-3.amazonaws.com/0%253A1_Page%25201.svg",
}: {
  url?: string;
}) => {
  const idsRefs = React.useRef<string[]>([]);
  const dispatch = useDispatch();

  const uniqueHash = `${hashCode(url)}`;

  return (
    <SVG
      cacheRequests={true}
      loader={<span>Loading...</span>}
      onError={(error) => console.log(error.message)}
      onLoad={(src, hasCache) => {
        const ids = idsRefs.current;
        // register all events on ids
        registerHoverEventsOnFigmaEls(ids);

        // get tree hierarchy
        const tree = getTreeHierarchyFromDOM(ids);

        const allIdsWithourFirstElement = ids.slice(1);

        dispatch(
          zonesUpdatedByElementId(
            allIdsWithourFirstElement.map((elementId) => ({
              ...defaultFigmaZoneWithoutId,
              elementId,
              name: elementId?.replace(`__${uniqueHash}`, ""),
              ...getRelativePosition(elementId),
            }))
          )
        );
        dispatch(zonesSetTree(tree));
      }}
      preProcessor={(code) => {
        // code is a svg string
        // replace width parameter of svg tag by width="100%"
        const newCode = code
          // add id = removeSvgId to parent svg element
          .replace(/<svg/g, `<svg id=${REMOTE_PARENT_SVG_ID}`)
          .replace(/width="[^"]+"/, 'width="100%"')
          //add svg tag attribute preserveAspectRatio="xMinYMin meet"
          .replace(/<svg/, '<svg preserveAspectRatio="xMinYMin meet"')
          // add to the first g tag of svg tag a light gray border
          .replace(
            /<g/,
            `<g stroke="${colorTheme[900]}" stroke-width="2" stroke-linejoin="round"`
          );

        // collect all the id of the svg element
        //remove id= and the double " at the beginning and the end of the string
        const ids = (code.match(/id="[^"]+"/g) ?? []).map((id) =>
          id.replace(/id="|"/g, "")
        );
        // based on the ids create a tree structure, where each id belonging to a g tag of the svg is a parent node
        // and the ids of the children are the children of the parent node

        // get the ids of all the direct children of the first id

        idsRefs.current = ids.map((id) => `${id}__${uniqueHash}`);

        return newCode;
      }}
      src={url}
      // **
      // unusued props
      // **
      // baseURL="/home"
      // description="The React logo"
      // title="React"
      uniqueHash={uniqueHash}
      uniquifyIDs={true}
    />
  );
};
export default memo(FetchedSVG);
