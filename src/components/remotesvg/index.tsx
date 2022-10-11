import React from "react";
import SVG from "react-inlinesvg";
import { colorTheme } from "../../theme";

const KEYS = {
  dataStroke: "data-stroke",
  dataStrokeWidth: "data-stroke-width",
};

const HIGHLIGHT_STYLE = {
  color: colorTheme[500],
  strokeWidth: 5,
};
const RemoteSVG = ({ url }: { url?: string }) => {
  const idsRefs = React.useRef<string[]>([]);
  return (
    <SVG
      cacheRequests={true}
      loader={<span>Loading...</span>}
      onError={(error) => console.log(error.message)}
      onLoad={(src, hasCache) => {
        console.log("src is" + src, hasCache);
        // find all svg element with id included in idsRefs.current array and add on hover event a red solid border
        idsRefs.current.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            element.addEventListener("mouseover", (e) => {
              e?.stopPropagation();

              const strokeWidth = parseInt(
                window.getComputedStyle(element)[
                  //@ts-ignore
                  "stroke-width"
                ].replace("px", "") ?? "0"
              );

              // save the original border stroke and width
              element.setAttribute(KEYS.dataStroke, element.style.stroke);
              element.setAttribute(KEYS.dataStrokeWidth, `${strokeWidth}`);
              element.style.stroke = HIGHLIGHT_STYLE.color;

              if (strokeWidth < HIGHLIGHT_STYLE.strokeWidth) {
                element.style.strokeWidth = `${HIGHLIGHT_STYLE.strokeWidth}`;
              }
            });
            element.addEventListener("mouseout", () => {
              //restore the dataset attributes
              element.style.stroke = element.dataset[KEYS.dataStroke] ?? "";
              element.style.strokeWidth =
                element.dataset[KEYS.dataStrokeWidth] ?? "";
            });
          }
        });
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
        idsRefs.current = (code.match(/id="[^"]+"/g) ?? []).map((id) =>
          id.replace(/id="|"/g, "")
        );

        return newCode;
      }}
      src="https://bytesim-bucket.s3.eu-west-3.amazonaws.com/0%253A1_Page%25201.svg"
      // **
      // unusued props
      // **
      // baseURL="/home"
      // description="The React logo"
      // title="React"
      // uniqueHash="a1f8d1"
      // uniquifyIDs={true}
    />
  );
};
export default RemoteSVG;
