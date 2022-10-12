import React, { useEffect } from "react";
import SVG from "react-inlinesvg";
import { useDispatch } from "react-redux";
import {
  allZonesDeleted as allZonesFigmaDeleted,
  zonesFigmaSetTree,
  zonesFigmaUpdated,
} from "../zonesFigmaSlice";
import { hashCode, registerHoverEventsOnFigmaEls } from "../utils";
import { colorTheme } from "../../../theme";

const RemoteSVG = ({
  url = "https://bytesim-bucket.s3.eu-west-3.amazonaws.com/0%253A1_Page%25201.svg",
}: {
  url?: string;
}) => {
  const idsRefs = React.useRef<string[]>([]);
  const dispatch = useDispatch();

  const uniqueHash = `${hashCode(url)}`;

  useEffect(() => {
    dispatch(allZonesFigmaDeleted());
  }, [url, dispatch]);

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
        const tree = getTreeHierarchy(ids);

        dispatch(
          zonesFigmaUpdated(
            ids.map((elementId) => ({
              elementId,
              name: elementId,
            }))
          )
        );
        // dispatch(zonesFigmaSetTree(tree));
      }}
      preProcessor={(code) => {
        // code is a svg string
        // replace width parameter of svg tag by width="100%"
        const newCode = code
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
export default RemoteSVG;
export type TreeEl = {
  id: string;
  children?: TreeEl[];
};
function getTreeHierarchy(idsToIndex: string[]) {
  const rootId = idsToIndex?.[0];
  const resultTree: TreeEl[] = [
    {
      id: rootId,
      children: [],
    },
  ];

  scrollThroughChildren(resultTree[0], idsToIndex, rootId);
  return resultTree;
}

const scrollThroughChildren = (
  resultTreeEl: TreeEl,
  idsToIndex: string | string[],
  parent: string
) => {
  const children = document?.getElementById(parent)?.children;
  if (!children) return;
  const chidrenIds = Array.from(children).map((child) => child.id);
  // if no childrenIds is included in idsToIndex, return
  if (!chidrenIds.some((id) => idsToIndex.includes(id))) return;
  //else add parent to id and recurse over
  chidrenIds?.forEach((id) => {
    if (id) {
      const newTreeEl = {
        id,
        children: [],
      };
      resultTreeEl.children?.push(newTreeEl);
      scrollThroughChildren(newTreeEl, idsToIndex, id);
    }
  });
};
