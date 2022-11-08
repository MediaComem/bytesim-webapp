import { Flex } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { useAppZones } from "../../app/hooks";
import FetchedSVG from "../../features/figma/components/FetchedSVG";
import { ZONES_MAX_WIDTH } from "../../services/const";
import ZoneFrame from "./ZoneFrame";

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
        opacity={0.5}
        width={`${ZONES_MAX_WIDTH * zoom}px`}
        minWidth={`${ZONES_MAX_WIDTH * zoom}px`}
        maxWidth={`${ZONES_MAX_WIDTH * zoom}px`}
        height={`${ZONES_MAX_WIDTH * zoom}px`}
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
          {/* <Route
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
          /> */}
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
