import { Flex, useDisclosure } from "@chakra-ui/react";
import * as React from "react";
import { css, cx } from "@emotion/css";
import { useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import { useSelectedZone, useAppZones } from "../../app/hooks";
import {
  zoneDeleted,
  zoneActiveToggled,
  zoneUpdated,
} from "../../features/zones/zonesSlice";
import REHome from "../../assets/RE-homepage.jpg";
import { Zone } from "../../app/types/types";
import CustomModal, { confirmText } from "../layout/CustomModal";
import UploadButton from "../project/UploadButton";

import { Route, Routes } from "react-router-dom";
import FetchedSVG from "../../features/figma/components/FetchedSVG";
import { colorTheme } from "../../theme";

import { ZONES_CONTAINER_WIDTH } from "../../services/const";
import { ZONES_CONTAINER_PADDING } from "../../features/figma/utils";
import { useEffect } from "react";

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
  zoom,
}: {
  disableEdition: boolean;
  zoom: number;
}) {
  const dispatch = useDispatch();
  const containerDim = `${ZONES_CONTAINER_WIDTH * zoom}px`;

  const selectedZone = useSelectedZone();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = (e: KeyboardEvent) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      onOpen();
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleDelete);
    return () => {
      document.removeEventListener("keydown", handleDelete);
    };
  }, []);
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
      <CustomModal
        texts={confirmText.deleteZone}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          if (selectedZone) {
            dispatch(zoneDeleted(selectedZone.id));
          }
          onClose();
        }}
      />
      <Flex
        opacity={0.5}
        width={containerDim}
        minWidth={containerDim}
        maxWidth={containerDim}
        height={containerDim}
        // transform={`scale(${zoom})`}
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
            path="bytesim-webapp/new"
            element={
              <Flex>
                <UploadButton />
              </Flex>
            }
          />
          <Route
            path="bytesim-webapp"
            element={
              <Flex>
                <div>
                  <img
                    src={REHome}
                    alt="RE homepage"
                    className={css({
                      //objectFit: "scale-down",
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left",
                      display: "block",
                      maxWidth: "300px",
                      maxHeight: "550px",
                      width: "auto",
                      height: "auto",
                      padding: "10px",
                      boxSizing: "border-box",
                      opacity: 0.5,
                    })}
                  />
                </div>
              </Flex>
            }
          />
        </Routes>
      </Flex>
      <Flex position="absolute">
        {zones.map((z) => {
          return (
            <ZoneFrame
              key={`${z.id}_${z.x}_${z.y}_${z.width}_${z.height}`}
              zone={z}
              disableEdition={disableEdition}
              zoom={zoom}
            />
          );
        })}
      </Flex>
    </Flex>
  );
}

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
      enableResizing={zone.status === "EDITING" && !disableEdition}
      disableDragging={disableEdition}
      onResizeStop={(e, direction, ref, delta, position) => {
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
