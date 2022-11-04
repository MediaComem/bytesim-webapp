import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Button,
  useDisclosure,
  Flex,
  Box,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";

import AccordionItemTitleCustom from "../layout/AccordionItemTitleCustom";
import ConfirmModal from "../layout/ConfirmModal";
import ZoneParams from "./ZoneParams";
import { ReactComponent as ResetIcon } from "../../assets/ResetIcon_Active_MouseOver.svg";
import { ReactComponent as TrashIcon } from "../../assets/TEMP_trash.svg";
import { css } from "@emotion/css";
import AccordionCustomTitle from "../layout/AccordionCustomTitle";
import { recommandationsReset } from "../../features/recommandations/recommandationsSlice";
import { ZoneListButton } from "./ZoneListButton";
import { Fragment, useState } from "react";
import {
  allZonesDeleted,
  allZonesReset,
  zoneDeleted,
} from "../../features/zones/zonesSlice";

export default function ZonesList() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const project = useAppSelector((state) => state.project);
  const drawnZones = useAppSelector((state) =>
    state.zonesSlice.zones.filter((zone) => zone.createdFrom === "user")
  );

  const ZONE_TAB_INDEX = 0;
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
    //default index is set to 0 to open zone tab by default
    <Accordion allowToggle defaultIndex={[ZONE_TAB_INDEX]}>
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionItemTitleCustom
              label={
                <AccordionCustomTitle label="Drawn zones" icon="drawnZone" />
              }
              p={2}
              isExpanded={isExpanded}
            >
              <Flex>
                <Button
                  variant={"ghost"}
                  size="sm"
                  onClick={() => {
                    setModalContent({
                      modal:
                        "Are you sure you want to reset all zones? It will delete all provided data.",
                      buttonLabel: "Reset all zones",
                      onConfirm: () => {
                        dispatch(allZonesReset());
                        dispatch(recommandationsReset());
                      },
                    });
                    onOpen();
                  }}
                  isDisabled={project.status === "SIMULATION"}
                >
                  Reset{" "}
                  <ResetIcon
                    className={css({ margin: "3px" })}
                    stroke="black"
                  />
                </Button>
                <Button
                  variant={"ghost"}
                  size="sm"
                  onClick={() => {
                    setModalContent({
                      modal:
                        "Are you sure you want to delete all zones? It will delete all drawn zones on the view panel and all data.",
                      buttonLabel: "Delete all zones",
                      onConfirm: () => {
                        dispatch(allZonesDeleted());
                      },
                    });
                    onOpen();
                  }}
                  isDisabled={project.status === "SIMULATION"}
                >
                  Delete all
                  <TrashIcon className={css({ margin: "3px" })} fill="black" />
                </Button>
              </Flex>
            </AccordionItemTitleCustom>
            <AccordionPanel p={0}>
              <Accordion allowToggle>
                {drawnZones.map((z, i) => {
                  return (
                    <Fragment key={`${z.id}_${i}`}>
                      <AccordionItem key={`${z.id}_${i}`} border="none">
                        {({ isExpanded }) => (
                          <>
                            <ZoneListButton
                              zone={z}
                              onOpen={() => {
                                setModalContent({
                                  modal:
                                    "Are you sure you want to delete the zone? It will delete the associated form too.",
                                  buttonLabel: "Delete zone",
                                  onConfirm: () => {
                                    dispatch(zoneDeleted(z.id));
                                  },
                                });
                                onOpen();
                              }}
                              isExpanded={isExpanded}
                              //setOpen={() => toggleAccordion(i)}
                            />
                            <AccordionPanel p={0} bg={"brand.50"}>
                              <Box p={2} pl={12}>
                                <Heading size={"xs"}>Type</Heading>
                                <Text fontSize={"xs"}>
                                  Specific settings on the page
                                </Text>
                              </Box>
                              <ZoneParams zone={z} />
                            </AccordionPanel>
                          </>
                        )}
                      </AccordionItem>
                    </Fragment>
                  );
                })}
              </Accordion>
            </AccordionPanel>
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
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
}
