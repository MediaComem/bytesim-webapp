import * as React from "react";
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
import ConfirmModal, { confirmText, ModalParams } from "../layout/ConfirmModal";
import ZoneParams from "./ZoneParams";
import { ReactComponent as ResetIcon } from "../../assets/ResetIcon_Active_MouseOver.svg";
import { ReactComponent as TrashIcon } from "../../assets/TEMP_trash.svg";
import { css } from "@emotion/css";
import AccordionCustomTitle from "../layout/AccordionCustomTitle";
import { recommandationsReset } from "../../features/recommandations/recommandationsSlice";
import { ZoneListButton } from "./ZoneListButton";
import {
  allZonesDeleted,
  allZonesReset,
  getSelectedZoneIndex,
  zoneDeleted,
} from "../../features/zones/zonesSlice";
import { Fragment } from "react";

export interface DynamicModalParams extends ModalParams {
  onConfirm: () => void;
}

export default function ZonesList() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  //const zones = state.zones;
  const [modalContent, setModalContent] = React.useState<DynamicModalParams>({
    title: "",
    text: "",
    onConfirm: () => {},
  });
  const ZONE_TAB_INDEX = 0;
  const openedZoneIndex = useAppSelector(getSelectedZoneIndex);
  const project = useAppSelector((state) => state.project);
  const drawnZones = useAppSelector((state) =>
    state.zonesSlice.zones.filter((zone) => zone.createdFrom === "user")
  );
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
                      ...confirmText.resetAllZones,
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
                      ...confirmText.deleteAllZones,
                      onConfirm: () => {
                        dispatch(allZonesDeleted());
                        //dispatch(recommandationsReset());
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
              <Accordion allowToggle index={[openedZoneIndex]}>
                {drawnZones.map((z, i) => {
                  return (
                    <Fragment
                      key={z.id}
                      // key={`${z.id}_${i}`} //TODO: @audreyhuguenin https://github.com/MediaComem/bytesim-webapp/pull/56#discussion_r1015274263
                    >
                      <AccordionItem key={`${z.id}_${i}`} border="none">
                        {({ isExpanded }) => (
                          <>
                            <ZoneListButton
                              zone={z}
                              onOpen={() => {
                                setModalContent({
                                  ...confirmText.deleteZone,
                                  onConfirm: () => {
                                    dispatch(zoneDeleted(z.id));
                                    dispatch(recommandationsReset());
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
              texts={modalContent}
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
