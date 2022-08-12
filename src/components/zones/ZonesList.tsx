import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Button,
  useDisclosure,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { Zone, ZoneType } from "../../app/types/types";
//import { PrettyZoneTypes } from "../../app/types";
import {
  zoneSelected,
  zoneReset,
  allZonesReset,
  zoneDeleted,
  //allZonesReset,
} from "../../features/zones/zonesSlice";
import AccordionItemTitleWithButton from "../layout/AccordionItemTitleWithButton";
import ConfirmModal from "../layout/ConfirmModal";
import ZoneParams from "./ZoneParams";
import ProgressPoints from "../layout/ProgressPoints";
import { VideoFormEntries } from "../../app/types/videoTypes";

export default function ZonesList() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const state = useAppSelector((state) => state);
  const zones = state.zones;
  const project = state.project;
  const [modalContent, setModalContent] = React.useState<{
    modal: string;
    buttonLabel: string;
    onConfirm: () => void;
  }>({
    modal: "",
    buttonLabel: "Confirm",
    onConfirm: () => {},
  });
  return (
    <AccordionItem>
      <AccordionItemTitleWithButton label="Drawn Zones" p={2}>
        <Button
          variant={"ghost"}
          size="sm"
          //onClick={() => dispatch(allZonesReset())}
          onClick={() => {
            setModalContent({
              modal:
                "Are you sure you want to reset all zones? It will delete all provided data.",
              buttonLabel: "Reset all zones",
              onConfirm: () => {
                dispatch(allZonesReset());
              },
            });
            onOpen();
          }}
          isDisabled={project.status === "SIMULATION"}
        >
          Reset ⟳
        </Button>
      </AccordionItemTitleWithButton>
      <AccordionPanel p={0}>
        <Accordion allowToggle>
          {zones.map((z, i) => {
            return (
              <AccordionItem
                key={i}
                onClick={() => dispatch(zoneSelected(z.id))}
              >
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
                />
                <AccordionPanel p={0}>
                  <ZoneParams zone={z} />
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
              </AccordionItem>
            );
          })}
        </Accordion>
      </AccordionPanel>
    </AccordionItem>
  );
}

interface ZoneListButtonProps {
  zone: Zone;
  onOpen: () => void;
}
function ZoneListButton({ zone, onOpen }: ZoneListButtonProps) {
  const dispatch = useDispatch();
  const projectStatus = useAppSelector((state) => state.project.status);
  return (
    <AccordionItemTitleWithButton
      bg={zone.status === "EDITING" ? "brand.100" : undefined}
      label={
        <Flex
          flex="1"
          align={"baseline"}
          fontStyle={zone.zoneType ? "normal" : "italic"}
          gap={2}
        >
          <Text whiteSpace="nowrap" fontSize="sm">
            {zone.name}
          </Text>
          {zone.zoneType && (
            <>
              <Text fontSize={"sm"} color={"gray"} whiteSpace="nowrap">
                {
                  Object.entries(ZoneType).find(
                    (s) => s[0] === zone.zoneType
                  )?.[1]
                }
              </Text>
              <ProgressPoints
                completeObject={VideoFormEntries}
                params={zone.params}
              />
            </>
          )}
        </Flex>
      }
    >
      <Flex>
        <Button
          variant={"ghost"}
          title="Reset zone"
          onClick={() => dispatch(zoneReset(zone.id))}
          isDisabled={projectStatus === "SIMULATION"}
        >
          ⟳
        </Button>
        <Button
          variant={"ghost"}
          onClick={onOpen}
          title="Delete zone"
          isDisabled={projectStatus === "SIMULATION"}
        >
          ✖︎
        </Button>
      </Flex>
    </AccordionItemTitleWithButton>
  );
}
