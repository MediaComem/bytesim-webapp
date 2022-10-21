import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Button,
  useDisclosure,
  Flex,
  Box,
  AccordionButton,
  Input,
  Text,
  Heading,
  ExpandedIndex,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { Zone, ZoneType } from "../../app/types/types";
//import { PrettyZoneTypes } from "../../app/types";
import {
  zoneSelected,
  allZonesReset,
  zoneDeleted,
  allZonesDeleted,
  zoneReset,
  zoneUpdated,
  //allZonesReset,
} from "../../features/zones/zonesSlice";
import AccordionItemTitleCustom from "../layout/AccordionItemTitleCustom";
import ConfirmModal from "../layout/ConfirmModal";
import ZoneParams from "./ZoneParams";
import { ReactComponent as ResetIcon } from "../../assets/ResetIcon_Active_MouseOver.svg";
import { ReactComponent as TrashIcon } from "../../assets/TEMP_trash.svg";
import { css, cx } from "@emotion/css";
import AccordionCustomTitle from "../layout/AccordionCustomTitle";
import AccordionChevron from "../layout/AccordionChevron";
import ProgressPoints from "../layout/ProgressPoints";
import { VideoFormEntries } from "../../app/types/videoTypes";
import { colorTheme } from "../..";
import { recommandationsReset } from "../../features/recommandations/recommandationsSlice";

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
  const [index, setIndex] = React.useState<ExpandedIndex>([]);
  return (
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
                <ResetIcon className={css({ margin: "3px" })} stroke="black" />
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
              {zones.map((z, i) => {
                return (
                  <>
                    <AccordionItem
                      key={i}
                      onClick={() => dispatch(zoneSelected(z.id))}
                      border="none"
                    >
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
                        </>
                      )}
                    </AccordionItem>
                  </>
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
  );
}

interface ZoneListButtonProps {
  zone: Zone;
  onOpen: () => void;
  isExpanded: boolean;
  closseAllItems: () => void;
  //setOpen: () => void;
}
function ZoneListButton({
  zone,
  isExpanded,
  onOpen,
  closseAllItems,
}: ZoneListButtonProps) {
  const dispatch = useDispatch();
  const projectStatus = useAppSelector((state) => state.project.status);
  const [value, setValue] = React.useState(zone.name);
  const [editNameMode, setEditNameMode] = React.useState(false);
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="nowrap"
        pl={5}
        _hover={{
          backgroundColor: "brand.100",
          ".visibleOnHover": {
            visibility: "visible",
          },
        }}
        style={
          zone.status === "EDITING"
            ? { backgroundColor: colorTheme[100] }
            : undefined
        }
      >
        <Flex align="center" justify="flex-start">
          <AccordionButton p={1} width="auto">
            <AccordionChevron isExpanded={isExpanded} />
          </AccordionButton>
          <AccordionCustomTitle
            label={
              <>
                {editNameMode ? (
                  <Input
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    onBlur={() => {
                      const newName = {
                        id: zone.id,
                        name: value,
                      };
                      dispatch(zoneUpdated(newName));
                      setEditNameMode(false);
                    }}
                    autoFocus
                    p={1}
                    whiteSpace={"nowrap"}
                    minW="100px"
                  />
                ) : (
                  <Text
                    ml={1}
                    //fontStyle={zone.zoneType ? "initial" : "italic"}
                    whiteSpace={"nowrap"}
                    onDoubleClick={() => setEditNameMode(true)}
                  >
                    {value}
                  </Text>
                )}
              </>
            }
            icon={"drawnZone"}
            iconClassName={css({ transform: "scale(0.8)" })}
          />
          <Text fontSize={"sm"} color={"gray"} whiteSpace="nowrap" ml={2}>
            {zone.zoneType
              ? Object.entries(ZoneType).find(
                  (s) => s[0] === zone.zoneType
                )?.[1]
              : "- undefined"}
          </Text>
          {zone.zoneType && (
            <ProgressPoints
              completeObject={
                zone.zoneType === "Video" ? VideoFormEntries : { text: true }
              }
              params={zone.zoneType === "Video" ? zone.params : { text: true }}
            />
          )}
        </Flex>
        <Flex className={cx("visibleOnHover ", css({ visibility: "hidden" }))}>
          <Button
            variant={"ghost"}
            title="Reset zone"
            onClick={() => {
              dispatch(zoneReset(zone.id));
              closseAllItems();
            }}
            isDisabled={projectStatus === "SIMULATION"}
          >
            <ResetIcon className={css({ margin: "3px" })} stroke="black" />
          </Button>
          <Button
            variant={"ghost"}
            onClick={onOpen}
            title="Delete zone"
            isDisabled={projectStatus === "SIMULATION"}
          >
            <TrashIcon className={css({ margin: "3px" })} fill="black" />
          </Button>
        </Flex>
      </Box>
    </>
  );
}
