import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  ExpandedIndex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { figmaZoneSelector, useAppSelector } from "../../app/hooks";
import { FigmaTreeEl, ZoneFigma } from "../../app/types/types";
import { highlightFigmaZone } from "../../features/figma/utils";
import { zoneFigmaDeleted } from "../../features/figma/zonesFigmaSlice";
import { zoneDeleted, zoneSelected } from "../../features/zones/zonesSlice";
import AccordionChevron from "../layout/AccordionChevron";
import AccordionCustomTitle from "../layout/AccordionCustomTitle";
import ConfirmModal from "../layout/ConfirmModal";
import { ZoneListButton } from "./ZoneListButton";
import ZoneParams from "./ZoneParams";

export default function MainGroupList() {
  const figmaZones = useAppSelector(figmaZoneSelector);

  const zones = figmaZones?.zones;
  const tree = figmaZones.tree;

  return (
    <AccordionItem isDisabled={false}>
      <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}>
        <AccordionChevron isExpanded={false} />
        <Box flex="1" textAlign="left">
          <AccordionCustomTitle label={"Main group"} icon="importedGroup" />
        </Box>
      </AccordionButton>

      {tree && unfoldTree(tree, zones)}
    </AccordionItem>
  );
}
const unfoldTree = (tree: FigmaTreeEl[], zones: ZoneFigma[]) => {
  return tree.map((t) => {
    return (
      <AccordionZones
        key={t.id}
        zones={zones.filter((z) => z.elementId === t.id)}
      >
        {t?.children?.length !== 0 && unfoldTree(t.children!, zones)}
      </AccordionZones>
    );
  });
};
const AccordionZones = ({
  zones,
  children = null,
}: {
  zones: ZoneFigma[];
  children?: any;
}) => {
  const [index, setIndex] = useState<ExpandedIndex>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch();

  const [modalContent, setModalContent] = useState<{
    modal: string;
    buttonLabel: string;
    onConfirm: () => void;
  }>({
    modal: "",
    buttonLabel: "Confirm",
    onConfirm: () => {},
  });

  return (
    <AccordionPanel p={0}>
      <Accordion allowToggle>
        {zones?.map((z, i) => {
          return (
            <AccordionItem
              key={z.id}
              onClick={() => dispatch(zoneSelected(z.id))}
              border="none"
            >
              {({ isExpanded }) => (
                <Box
                  onMouseEnter={() => highlightFigmaZone(z.elementId)}
                  onMouseLeave={() => highlightFigmaZone(z.elementId, false)}
                >
                  <ZoneListButton
                    zone={z}
                    onOpen={() => {
                      setModalContent({
                        modal:
                          "Are you sure you want to delete the zone? It will delete the associated form too.",
                        buttonLabel: "Delete zone",
                        onConfirm: () => {
                          dispatch(zoneFigmaDeleted(z.id));
                        },
                      });
                      onOpen();
                    }}
                    isExpanded={isExpanded}
                    closseAllItems={() => setIndex([])}
                    //setOpen={() => toggleAccordion(i)}
                  />
                  <AccordionPanel p={0} bg={"brand.50"}>
                    <Box p={2} pl={12}>
                      <Heading size={"xs"}>Type</Heading>
                      <Text fontSize={"xs"}>Specific settings on the page</Text>
                    </Box>
                    <ZoneParams zone={z} index={index} setIndex={setIndex} />
                  </AccordionPanel>
                  {children}
                </Box>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
      <ConfirmModal
        headerText={modalContent.buttonLabel}
        message={modalContent.modal}
        buttonLabel={modalContent.buttonLabel}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          modalContent.onConfirm();
          onClose();
        }}
      />
    </AccordionPanel>
  );
};
