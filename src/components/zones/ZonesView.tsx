import { Flex } from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import { useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import { Route, Routes } from "react-router-dom";
import { useAppZones } from "../../app/hooks";

import TestSVG from "../layout/TestSVG";
import FetchedSVG from "../../features/figma/components/FetchedSVG";
import REHome from "../../assets/RE-homepage.jpg";
import REabout from "../../assets/RE-about.jpg";
import REmap from "../../assets/RE-map.jpg";
import { colorTheme } from "../../theme";

import { ZONES_MAX_WIDTH } from "../../services/conts";
import { ZONES_CONTAINER_PADDING } from "../../features/figma/utils";
import {
  zoneActiveToggled,
  zoneUpdated,
} from "../../features/zones/newZonesSlice";
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

export default function ZonesView({
  disableEdition,
}: {
  disableEdition: boolean;
}) {
  const dispatch = useDispatch();
  const zones = useAppZones()?.filter((z) => !z.hidden);
  return (
    <Flex
      align={"flex-start"}
      justify={"flex-start"}
      pos={"relative"}
      p={ZONES_CONTAINER_PADDING}
      overflow={"auto"}
      grow={1}
      alignSelf="stretch"
    >
      <Flex
        opacity={0.5}
        width={`${ZONES_MAX_WIDTH}px`}
        minWidth={ZONES_MAX_WIDTH}
        maxWidth={ZONES_MAX_WIDTH}
      >
        <Routes>
          <Route
            path="bytesim-webapp/figma/*"
            element={
              <Flex>
                <FetchedSVG />
              </Flex>
            }
          />
          <Route
            path="bytesim-webapp/1/*"
            element={
              <Flex>
                <TestSVG />
              </Flex>
            }
          />
          <Route
            path="bytesim-webapp/2/*"
            element={
              <Flex>
                <img src={REHome} alt="RE homepage" />
              </Flex>
            }
          />
          <Route
            path="bytesim-webapp/3/*"
            element={
              <Flex>
                <img src={REabout} alt="RE about page" />
              </Flex>
            }
          />
          <Route
            path="bytesim-webapp/4/*"
            element={
              <Flex>
                <img src={REmap} alt="RE network map" />
              </Flex>
            }
          />
          <Route
            path="bytesim-webapp/*"
            element={
              <Flex>
                <TestSVG />
              </Flex>
            }
          />
        </Routes>
      </Flex>
      {zones.map((z) => {
        return (
          <Rnd
            key={z.id}
            default={{
              x: z.x,
              y: z.y,
              width: z.width,
              height: z.height,
            }}
            className={cx(zoneStyle, {
              [selectedZoneStyle]: z.status === "EDITING",
            })}
            onMouseDown={() => dispatch(zoneActiveToggled(z.id))}
            enableResizing={z.status === "EDITING" && !disableEdition}
            disableDragging={disableEdition}
            onResizeStop={(e, direction, ref, delta, position) => {
              const newZone = {
                id: z.id,
                x: position.x,
                y: position.y,
                width: z.width + delta.width,
                height: z.height + delta.height,
              };
              dispatch(zoneUpdated(newZone));
            }}
            onDragStop={(e, d) => {
              const newPos = {
                id: z.id,
                x: d.x,
                y: d.y,
              };
              dispatch(zoneUpdated(newPos));
            }}
            resizeHandleComponent={handleComp}
          >
            <p className={aboveZoneStyle}>{z.name}</p>
          </Rnd>
        );
      })}
    </Flex>
  );
}
