import {
  Box,
  ButtonGroup,
  Flex,
  Heading,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import { useDispatch, useSelector } from "react-redux";
import { Rnd } from "react-rnd";

import {
  zoneDeleted,
  zoneActiveToggled,
  zoneUpdated,
  zoneToggleHidden,
  zonesUpdatePosition,
} from "../../features/zones/zonesSlice";
import { Zone } from "../../app/types/types";
import CustomModal, { confirmText } from "../layout/CustomModal";
import UploadButton from "../project/UploadButton";

import { Route, Routes } from "react-router-dom";
import FetchedSVG from "../../features/figma/components/FetchedSVG";
import { colorTheme } from "../../theme";

import {
  getSvgDims,
  ZONES_CONTAINER_PADDING,
} from "../../features/figma/utils";
import { memo, useCallback, useEffect, useState } from "react";
import useSize from "../../hooks/useSize";
import { isEqual } from "lodash";
import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/hooks";

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
  const [refContainer, setRefContainer] = useState<HTMLDivElement | null>(null);
  const containerSize = useSize(refContainer);
  const [svgLoaded, setSvgLoaded] = useState("");

  const updateZonePostions = useCallback(() => {
    const containerDim = getSvgDims();
    if (!containerDim) return;
    dispatch(
      zonesUpdatePosition({
        containerWidth: containerDim?.width,
        containerHeight: containerDim?.height,
      })
    );
  }, [containerSize?.width, containerSize?.height]);

  useEffect(() => {
    updateZonePostions();
  }, [containerSize?.width, svgLoaded]);
  const zones = useAppSelector(
    (state: RootState) => state.zonesSlice.zones.filter((z) => !z.hidden),
    isEqual
  );

  // const selectedZone = useSelectedZone();
  const selectedZone = zones?.find((z) => z.status === "EDITING");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = (e: KeyboardEvent) => {
    if ((e.key === "Backspace" || e.key === "Delete") && selectedZone) {
      if (selectedZone.createdFrom === "user") onOpen();
      else dispatch(zoneToggleHidden(selectedZone.id));
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleDelete);
    return () => {
      document.removeEventListener("keydown", handleDelete);
    };
  }, [selectedZone]);
  return (
    <Flex
      align={"flex-start"}
      justify={"flex-start"}
      pos={"relative"}
      p={ZONES_CONTAINER_PADDING}
      overflow={"auto"}
      grow={1}
      alignSelf="stretch"
      id="zones-container"
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
      <Routes>
        <Route
          path="figma/*"
          element={
            <Flex
              minWidth={`calc(${zoom * 100}%)`}
              width={`calc(${zoom * 100}%)`}
              ref={(ref) => {
                if (!ref) return;
                setRefContainer(ref);
              }}
            >
              <Flex opacity={0.5} width={"100%"}>
                <FetchedSVG onLoaded={setSvgLoaded} />
              </Flex>
            </Flex>
          }
        />
        <Route
          path="/*"
          element={
            <>
              <Box p="2">
                <Heading size="md">
                  Please import your design to analyze it
                </Heading>
              </Box>
              <Spacer />
              <ButtonGroup gap="2">
                <UploadButton />
              </ButtonGroup>
            </>
          }
        />
      </Routes>
      <Flex
        position="absolute"
        h={containerSize?.height + "px"}
        w={containerSize?.width + "px"}
      >
        {zones.map((z) => {
          return (
            <ZoneFrame
              key={`${z.id}_${z.x}_${z.y}_${z.width}_${z.height}}`}
              zone={z}
              isSelectedZone={z.id !== selectedZone?.id}
              disableEdition={disableEdition}
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
  isSelectedZone: boolean;
  disableEdition: boolean;
}
const ZoneFrame = memo(function ZoneFrame({
  //RCmenustate,
  zone,
  disableEdition,
  isSelectedZone,
}: ZoneFrameProps) {
  const dispatch = useDispatch();

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
        width: zone.width,
        height: zone.height,
      }}
      position={{
        x: zone.x,
        y: zone.y,
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
          (e.button === MOUSE_RIGHT_BUTTON && isSelectedZone)
        ) {
          dispatch(zoneActiveToggled(zone.id));
        }
      }}
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
}, isEqual);
