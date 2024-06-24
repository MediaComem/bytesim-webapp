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
import CustomModal, { confirmText, ModalParams } from "../layout/CustomModal";
import ZoneParams from "./ZoneParams";
import { ReactComponent as ResetIcon } from "../../assets/ResetIcon.svg";
import { ReactComponent as TrashIcon } from "../../assets/TEMP_trash.svg";
import { css } from "@emotion/css";
import AccordionCustomTitle from "../layout/AccordionCustomTitle";
import { recommandationsReset } from "../../features/recommandations/recommandationsSlice";
import { ZoneListButton } from "./ZoneListButton";
import {
  allDrawnZonesDeleted,
  allZonesReset,
  getSelectedDrawnZoneIndex,
  zoneDeleted,
} from "../../features/zones/zonesSlice";
import { memo, useCallback } from "react";
import { isEqual } from "lodash";
import { Zone } from "../../app/types/types";

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

  const project = useAppSelector((state) => state.project);

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
                        dispatch(allDrawnZonesDeleted());
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
              <AccordionDrawnZones
                onOpen={onOpen}
                setModalContent={setModalContent}
              />
            </AccordionPanel>
            <CustomModal
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

const AccordionDrawnZones = ({
  setModalContent,
  onOpen,
}: {
  setModalContent: React.Dispatch<React.SetStateAction<DynamicModalParams>>;
  onOpen: () => void;
}) => {
  const openedZoneIndex = useAppSelector(getSelectedDrawnZoneIndex);
  const drawnZones = useAppSelector(
    (store) => store.zonesSlice.zones.filter((z) => z.createdFrom === "user"),
    isEqual
  );
  return (
    <Accordion allowToggle index={openedZoneIndex}>
      {drawnZones.map((z) => {
        return (
          <ZoneItem
            key={z.id}
            zone={z}
            setModalContent={setModalContent}
            onOpen={onOpen}
          />
        );
      })}
    </Accordion>
  );
};

const ZoneItem = React.memo(function ZoneItemComp({
  zone,
  setModalContent,
  onOpen,
}: {
  zone: Zone;
  setModalContent: React.Dispatch<React.SetStateAction<DynamicModalParams>>;
  onOpen: () => void;
}) {
  const dispatch = useDispatch();
  const onOpenCallback = useCallback(() => {
    setModalContent({
      ...confirmText.deleteZone,
      onConfirm: () => {
        dispatch(zoneDeleted(zone.id));
        dispatch(recommandationsReset());
      },
    });
    onOpen();
  }, []);
  return (
    <AccordionItem key={`${zone.id}`} border="none">
      {({ isExpanded }) => {
        return (
          <AccordionContent
            isExpanded={isExpanded}
            zone={zone}
            onOpenCallback={onOpenCallback}
          />
        );
      }}
    </AccordionItem>
  );
},
isEqual);

const AccordionContent = memo(function InnerAccordionContent({
  isExpanded,
  zone,
  onOpenCallback,
}: {
  isExpanded: boolean;
  zone: Zone;
  onOpenCallback: () => void;
}) {
  return (
    <>
      <ZoneListButton
        zone={zone}
        onOpen={onOpenCallback}
        isExpanded={isExpanded}
        //setOpen={() => toggleAccordion(i)}
      />
      <AccordionPanel p={0} bg={"brand.50"}>
        <Box p={2} pl={12}>
          <Heading size={"xs"}>Type</Heading>
          <Text fontSize={"xs"}>Specific settings on the page</Text>
        </Box>
        <ZoneParams zone={zone} />
      </AccordionPanel>
    </>
  );
},
isEqual);
