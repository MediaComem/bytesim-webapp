import { colorTheme } from "../../theme";

// simple hash function, do not use for sensitive data
export const hashCode = (str: string) =>
  str.split("").reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0);

const KEYS = {
  dataStroke: "data-stroke",
  dataStrokeWidth: "data-stroke-width",
};

const HIGHLIGHT_STYLE = {
  color: colorTheme[500],
  strokeWidth: 5,
};

export const registerHoverEventsOnFigmaEls = (ids: string[]) => {
  // find all svg element with id included in idsRefs.current array and add on hover event a red solid border
  ids.forEach((id) => {
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
        element.style.strokeWidth = element.dataset[KEYS.dataStrokeWidth] ?? "";
      });
    }
  });
};

export const highlightFigmaZone = (elementId: string, highlight?: boolean) => {
  document.getElementById(elementId)?.dispatchEvent(
    new MouseEvent(highlight !== false ? "mouseover" : "mouseout", {
      view: window,
      bubbles: true,
      cancelable: true,
    })
  );
};
