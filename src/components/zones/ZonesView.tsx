import { Flex, useDisclosure } from "@chakra-ui/react";
import * as React from "react";
import { css, cx } from "@emotion/css";
import { useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import { useAppSelector, useSelectedZone } from "../../app/hooks";
import {
  zoneDeleted,
  zoneActiveToggled,
  zoneUpdated,
} from "../../features/zones/zonesSlice";
import REHome from "../../assets/RE-homepage.jpg";
import { Zone } from "../../app/types/types";
import ConfirmModal, { confirmText } from "../layout/ConfirmModal";
import { useLocation } from "react-router-dom";
import UploadButton from "../project/UploadButton";

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
  zoom,
}: {
  disableEdition: boolean;
  zoom: number;
}) {
  const dispatch = useDispatch();
  const zones = useAppSelector((state) => state.zones);
  const location = useLocation();
  //Waiting for blob to be in S3 database
  /* const projectScreenshot = useAppSelector(
    (state) => state.project.screenshotBlob
  ); */
  const selectedZone = useSelectedZone();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = (e: KeyboardEvent) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      onOpen();
    }
  };
  React.useEffect(() => {
    document.addEventListener("keydown", handleDelete);
    return () => {
      document.removeEventListener("keydown", handleDelete);
    };
  }, []);
  return (
    <Flex
      align={"flex-start"}
      justify={"flex-start"}
      pos={"relative"}
      p={1}
      overflow={"auto"}
      grow={1}
      alignSelf="stretch"
    >
      <ConfirmModal
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
      {location.pathname === "/bytesim-webapp/new" ? (
        <UploadButton />
      ) : (
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
              opacity: 0.5
            })}
          />
        </div>
      )}
      {/* {projectScreenshot ? (
            <img src={projectScreenshot} alt="screenshot" />
          ) : (
            <img src={REHome} alt="RE homepage" />
       )} */}
      {/*
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
        </Routes> */}

      {zones.map((z) => {
        return (
          <ZoneFrame
            key={z.id}
            zone={z}
            disableEdition={disableEdition}
            zoom={zoom}
          />
        );
      })}
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
      onMouseDown={() => dispatch(zoneActiveToggled(zone.id))}
      enableResizoneing={zone.status === "EDITING" && !disableEdition}
      disableDragging={disableEdition}
      onResizeStop={(e, direction, ref, delta, position) => {
        console.log('width ' + delta.width + ' height ' + delta.height);
        console.log('X ' + position.x + ' Y ' + position.y);
        const newZone = {
          id: zone.id,
          x: position.x / zoom,
          y: position.y / zoom,
          width: zone.width + (delta.width / zoom),
          height: zone.height + (delta.height / zoom),
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
