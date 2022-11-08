import { css, cx } from "@emotion/css";
import { useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import { useSelectedZone } from "../../app/hooks";
import { Zone } from "../../app/types/types";
import {
  zoneActiveToggled,
  zoneUpdated,
} from "../../features/zones/zonesSlice";
import { colorTheme } from "../../theme";

const brandColor = colorTheme[400];
const resizeHandleSVG = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="7"
      y="7"
      width="14"
      height="14"
      fill="white"
      stroke={brandColor}
      strokeWidth="2"
    />
  </svg>
);
const handleComp = {
  topRight: resizeHandleSVG,
  bottomRight: resizeHandleSVG,
  bottomLeft: resizeHandleSVG,
  topLeft: resizeHandleSVG,
};
const zoneStyle = css({
  border: `2px solid ${brandColor}55`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: `${brandColor}09`,
  color: `${brandColor}`,
});
const selectedZoneStyle = css({
  border: `2px solid ${brandColor}`,
  fontWeight: "bold",
});
const aboveZoneStyle = css({
  marginTop: "-20px",
  whiteSpace: "nowrap",
  fontSize: "0.85em",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

interface ZoneFrameProps {
  //RCmenustate:RightClickMenuState;
  zone: Zone;
  disableEdition: boolean;
  zoom: number;
}
function ZoneFrame({
  //RCmenustate,
  zone,
  disableEdition,
  zoom,
}: ZoneFrameProps) {
  const dispatch = useDispatch();
  const selectedZone = useSelectedZone();
  return (
    <Rnd
      key={zone.id}
      // key={`${z.id}_${z.x}_${z.y}_${z.width}_${z.height}`}
      id={zone.id}
      default={{
        x: zone.x,
        y: zone.y,
        width: zone.width,
        height: zone.height,
      }}
      size={{
        width: zone.width * zoom,
        height: zone.height * zoom,
      }}
      position={{
        x: zone.x * zoom,
        y: zone.y * zoom,
      }}
      className={
        "rightClickable " +
        cx(zoneStyle, {
          [selectedZoneStyle]: zone.status === "EDITING",
        })
      }
      onMouseDown={(e) => {
        const MOUSE_MAIN_BUTTON = 0;
        const MOUSE_RIGHT_BUTTON = 2;
        if (
          e.button === MOUSE_MAIN_BUTTON ||
          (e.button === MOUSE_RIGHT_BUTTON && zone.id !== selectedZone?.id)
        ) {
          dispatch(zoneActiveToggled(zone.id));
        }
      }}
      enableResizoneing={zone.status === "EDITING" && !disableEdition}
      disableDragging={disableEdition}
      onResizeStop={(e, direction, ref, delta, position) => {
        console.log("width " + delta.width + " height " + delta.height);
        console.log("X " + position.x + " Y " + position.y);
        const newZone = {
          id: zone.id,
          x: position.x / zoom,
          y: position.y / zoom,
          width: zone.width + delta.width / zoom,
          height: zone.height + delta.height / zoom,
        };
        dispatch(zoneUpdated(newZone));
      }}
      onDragStop={(e, d) => {
        const newPos = {
          id: zone.id,
          x: d.x / zoom,
          y: d.y / zoom,
        };
        dispatch(zoneUpdated(newPos));
      }}
      resizeHandleComponent={handleComp}
    >
      <p className={aboveZoneStyle}>{zone.name}</p>
    </Rnd>
  );
}

export default ZoneFrame;
