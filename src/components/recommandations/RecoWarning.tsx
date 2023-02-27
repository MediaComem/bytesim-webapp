import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Link,
  Text,
} from "@chakra-ui/react";
import { ReactComponent as WarningIcon } from "../../assets/Warning.svg";
import AccordionChevron from "../layout/AccordionChevron";
import * as React from "react";
import { ZoneMissingParams } from "../../app/types/types";
import { useDispatch } from "react-redux";
import { zoneActivate } from "../../features/zones/zonesSlice";
import { css } from "@emotion/css";
import { memo } from "react";

interface RecoWarningProps {
  isHidden: boolean;
  isToggled: boolean;
  uncompleteZoneNames: Array<ZoneMissingParams>;
  toggleErrorPannel: () => void;
}
const RecoWaring = memo(function RecoWarning({
  isHidden,
  isToggled,
  uncompleteZoneNames,
  toggleErrorPannel,
}: RecoWarningProps) {
  const dispatch = useDispatch();
  function toggleZone(zoneId: string): void {
    dispatch(zoneActivate(zoneId));
  }

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <AccordionItem
      hidden={isHidden}
      display="flex"
      flexDirection={"column"}
      overflow="hidden"
      flexShrink={0}
      maxHeight="100%"
      className={css({
        ".chakra-collapse": {
          display: "flex !important",
          overflow: "auto !important",
        },
        borderTop: "none",
      })}
    >
      <AccordionButton
        _hover={{ backgroundColor: "brand.100" }}
        pl={4}
        onClick={toggleErrorPannel}
      >
        <Center>
          <AccordionChevron
            isWarning={true}
            isExpanded={isToggled}
            color="#C53030"
          />
          <Box>
            <Text pl={2} mr={2} align="left" fontSize="xs" color={"#C53030"}>
              You have uncompleted zones that are not taken into account in the
              calculation.
            </Text>
          </Box>
          <Box pt={1}>
            <WarningIcon />
          </Box>
        </Center>
      </AccordionButton>
      <AccordionPanel pb={4} height={"full"}>
        {Object.values(uncompleteZoneNames).map((zone) => (
          <Box p={4} key={zone.zoneId}>
            <Text fontSize="xs" color={"#C53030"}>
              <Link
                onClick={() => {
                  toggleZone(zone.zoneId);
                }}
                title="Open zone in parameters panel"
              >
                <Text as="u">
                  <Text as="b">{zone.zoneName}</Text>
                </Text>
              </Link>{" "}
              - {zone.zoneType}
              {zone.zoneType !== "undefined" && (
                <Text mt={1}>
                  Missing parameters:
                  <br />
                  {zone.zoneMissingParams.map((param, index) => (
                    <span key={param}>
                      {index === 0 ? `${capitalizeFirstLetter(param)}` : ``}
                      {index !== 0 &&
                      index !== zone.zoneMissingParams.length - 1
                        ? `, ${capitalizeFirstLetter(param)}`
                        : ``}
                      {zone.zoneMissingParams.length > 1 &&
                      index === zone.zoneMissingParams.length - 1
                        ? ` & ${capitalizeFirstLetter(param)}`
                        : ``}
                    </span>
                  ))}
                </Text>
              )}
            </Text>
          </Box>
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
});
export default RecoWaring;
