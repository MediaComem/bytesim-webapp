import { Flex } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { useAppZones } from "../../app/hooks";
import FetchedSVG from "../../features/figma/components/FetchedSVG";
import { ZONES_MAX_WIDTH } from "../../services/const";
import ZoneFrame from "./ZoneFrame";
import REHome from "../../assets/RE-homepage.jpg";
import { css } from "@emotion/css";
import UploadButton from "../project/UploadButton";

export default function ZonesView({
  disableEdition,
  zoom,
}: {
  disableEdition: boolean;
  zoom: number;
}) {
  const zones = useAppZones()?.filter((z) => !z.hidden);
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
      <Flex
        width={`${ZONES_MAX_WIDTH * zoom}px`}
        minWidth={`${ZONES_MAX_WIDTH * zoom}px`}
        maxWidth={`${ZONES_MAX_WIDTH * zoom}px`}
        height={`${ZONES_MAX_WIDTH * zoom}px`}
      >
        <Routes>
          <Route
            path="bytesim-webapp/figma/*"
            element={
              <Flex opacity={0.5}>
                <FetchedSVG />
              </Flex>
            }
          />
          <Route
            path="bytesim-webapp/"
            element={
              <Flex opacity={0.5}>
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
              </Flex>
            }
          />
          <Route path="bytesim-webapp/new" element={<UploadButton />} />
        </Routes>

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
    </Flex>
  );
}
