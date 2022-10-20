import { Flex } from "@chakra-ui/react";
import * as React from "react";
import { css, cx } from "@emotion/css";
import { useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { zoneSelected, zoneUpdated } from "../../features/zones/zonesSlice";
import TestSVG from "../layout/TestSVG";
import REHome from "../../assets/RE-homepage.jpg";
import REabout from "../../assets/RE-about.jpg";
import REmap from "../../assets/RE-map.jpg";
import { Zone } from "../../app/types/types";
//import RightClickMenu from "../layout/RightClickMenu";
const brandColor = "#ea62ea";
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
  const zones = useAppSelector((state) => state.zones);
  return (
    <Flex
      align={"flex-start"}
      justify={"flex-start"}
      pos={"relative"}
      p={6}
      overflow={"auto"}
      grow={1}
      alignSelf="stretch"
    >
      <Flex opacity={0.5} width="400" minWidth="400" maxWidth="400">
        <Routes>
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
          <ZoneFrame key={z.id} zone={z} disableEdition={disableEdition} />
        );
      })}
    </Flex>
  );
}

interface ZoneFrameProps {
  //RCmenustate:RightClickMenuState;
  zone: Zone;
  disableEdition: boolean;
}
function ZoneFrame({
  //RCmenustate,
  zone,
  disableEdition,
}: ZoneFrameProps) {
  const dispatch = useDispatch();
  const handleClick = (e: MouseEvent, z: Zone) => {
    dispatch(zoneSelected(z.id));
/*     console.log(e.button);
    if (e.button === 2) {
      e.preventDefault();
      setState({
        showMenu: true,
        xPos: e.pageX,
        yPos: e.pageY,
      });
    } else {
      setState({
        ...state,
        showMenu: false,
      });
    } */
  };

  return (
    <Rnd
      key={zone.id}
      id={zone.id}
      default={{
        x: zone.x,
        y: zone.y,
        width: zone.width,
        height: zone.height,
      }}
      className={
        "rightClickable " +
        cx(zoneStyle, {
          [selectedZoneStyle]: zone.status === "EDITING",
        })
      }
      onMouseDown={(e) => handleClick(e, zone)}
      enableResizing={zone.status === "EDITING" && !disableEdition}
      disableDragging={disableEdition}
      onResizeStop={(e, direction, ref, delta, position) => {
        const newZone = {
          id: zone.id,
          x: position.x,
          y: position.y,
          width: zone.width + delta.width,
          height: zone.height + delta.height,
        };
        dispatch(zoneUpdated(newZone));
      }}
      onDragStop={(e, d) => {
        const newPos = {
          id: zone.id,
          x: d.x,
          y: d.y,
        };
        dispatch(zoneUpdated(newPos));
      }}
      resizeHandleComponent={handleComp}
    >
      <p className={aboveZoneStyle}>{zone.name}</p>
    </Rnd>
  );
}
