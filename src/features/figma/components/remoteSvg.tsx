import React, { useEffect } from "react";
import SVG from "react-inlinesvg";
import { useDispatch } from "react-redux";
import {
  allZonesDeleted as allZonesFigmaDeleted,
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
        // register all events on ids
        registerHoverEventsOnFigmaEls(idsRefs.current);
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
        idsRefs.current = ids.map((id) => `${id}__${uniqueHash}`);
        dispatch(
          zonesFigmaUpdated(
            ids.map((elementId) => ({
              elementId: `${elementId}__${uniqueHash}`,
              name: elementId,
            }))
          )
        );

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
