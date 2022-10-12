import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  ExpandedIndex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { figmaZoneSelector, useAppSelector } from "../../app/hooks";
import { Zone } from "../../app/types/types";
import { highlightFigmaZone } from "../../features/figma/utils";
import { zoneSelected, zoneDeleted } from "../../features/zones/zonesSlice";
import AccordionChevron from "../layout/AccordionChevron";
import AccordionCustomTitle from "../layout/AccordionCustomTitle";
import { ZoneListButton } from "./ZoneListButton";
import ZoneParams from "./ZoneParams";

export default function MainGroupList() {
  const figmaZones = useAppSelector(figmaZoneSelector);
  const dispatch = useDispatch();
  const [index, setIndex] = useState<ExpandedIndex>([]);

  return (
    <AccordionItem isDisabled={false}>
      <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}>
        <AccordionChevron isExpanded={false} />
        <Box flex="1" textAlign="left">
          <AccordionCustomTitle label={"Main group"} icon="importedGroup" />
        </Box>
      </AccordionButton>
      {/* <AccordionPanel>Nothing here yet.</AccordionPanel> */}
      <AccordionPanel p={0}>
        <Accordion allowToggle>
          {figmaZones.map((z, i) => {
            return (
              <>
                <AccordionItem
                  key={i}
                  onClick={() => dispatch(zoneSelected(z.id))}
                  border="none"
                >
                  {({ isExpanded }) => (
                    <Box
                      onMouseEnter={() => highlightFigmaZone(z.elementId)}
                      onMouseLeave={() =>
                        highlightFigmaZone(z.elementId, false)
                      }
                    >
                      <ZoneListButton
                        zone={z}
                        onOpen={() => {
                          // setModalContent({
                          //   modal:
                          //     "Are you sure you want to delete the zone? It will delete the associated form too.",
                          //   buttonLabel: "Delete zone",
                          //   onConfirm: () => {
                          //     dispatch(zoneDeleted(z.id));
                          //   },
                          // });
                          // onOpen();
                        }}
                        isExpanded={isExpanded}
                        closseAllItems={() => setIndex([])}
                        //setOpen={() => toggleAccordion(i)}
                      />
                      <AccordionPanel p={0} bg={"brand.50"}>
                        <Box p={2} pl={12}>
                          <Heading size={"xs"}>Type</Heading>
                          <Text fontSize={"xs"}>
                            Specific settings on the page
                          </Text>
                        </Box>
                        <ZoneParams
                          zone={z}
                          index={index}
                          setIndex={setIndex}
                        />
                      </AccordionPanel>
                    </Box>
                  )}
                </AccordionItem>
              </>
            );
          })}
        </Accordion>
      </AccordionPanel>
    </AccordionItem>
  );
}
