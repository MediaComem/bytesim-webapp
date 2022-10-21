import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  ExpandedIndex,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { DynContentFormEntries } from "../../app/types/dynContentTypes";
import { Zone, ZoneType } from "../../app/types/types";
import { VideoFormEntries } from "../../app/types/videoTypes";
import { zoneUpdated } from "../../features/zones/zonesSlice";
import AccordionChevron from "../layout/AccordionChevron";
import ConfirmModal from "../layout/ConfirmModal";
import ZoneSettingsForm from "./zones_settings/ZoneSettingsForm";

interface ZoneParamsProps {
  zone: Zone;
  index: ExpandedIndex;
  setIndex: React.Dispatch<React.SetStateAction<ExpandedIndex>>;
}
export default function ZoneParams({ zone, index, setIndex }: ZoneParamsProps) {
  const dispatch = useDispatch();
  const projectStatus = useAppSelector((state) => state.project.status);
  const { onOpen } = useDisclosure();
  const [onConfirm, setOnConfirm] = React.useState<() => void>();
  return (
    <>
      <Accordion allowToggle index={index} onChange={setIndex}>
        <ConfirmModalChangeType onConfirm={onConfirm} />
        {(Object.keys(ZoneType) as Array<keyof typeof ZoneType>).map((z, i) => {
          if (z === "Text") {
            return (
              <AccordionItem p={2} pl={12} display="flex" key={i} border="none">
                <Checkbox
                  colorScheme={"brand"}
                  isChecked={zone.zoneType === "Text"}
                  mr={3}
                  onChange={(e) => {
                    const newType = e.target.checked
                      ? (z as ZoneType)
                      : undefined;
                    if (zone.zoneType !== undefined) {
                      setOnConfirm(() => {
                        dispatch(
                          zoneUpdated({
                            id: zone.id,
                            zoneType: newType,
                            params: undefined,
                          })
                        );
                      });
                      onOpen();
                    } else {
                      dispatch(
                        zoneUpdated({
                          id: zone.id,
                          zoneType: newType,
                          params: undefined,
                        })
                      );
                    }
                  }}
                  isDisabled={projectStatus === "SIMULATION"}
                />
                <div>{z}</div>
              </AccordionItem>
            );
          } else {
            return (
              <AccordionItem key={i} border="none">
                {({ isExpanded }) => (
                  <>
                    <Flex align="center">
                      <AccordionButton pl={12} pr={2} w={"auto"}>
                        <AccordionChevron isExpanded={isExpanded} />
                      </AccordionButton>
                      <div>{ZoneType[z]}</div>
                    </Flex>
                    <AccordionPanel>
                      <ZoneParamsForm
                        zoneId={zone.id}
                        zoneType={z as ZoneType}
                      />
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            );
          }
        })}
      </Accordion>
    </>
  );
}
//! To be removed if no longer used
function ConfirmModalChangeType({ onConfirm }: { onConfirm?: () => void }) {
  const { isOpen, onClose } = useDisclosure();
  return (
    <ConfirmModal
      headerText={"Change zone type"}
      message={
        "Are you sure you want to change the type of the zone? It will delete all the provided data in other type."
      }
      buttonLabel={"Change type"}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => {
        if (onConfirm) {
          onConfirm();
        }
        onClose();
      }}
    />
  );
}
interface ZoneParamsFormProps {
  zoneId: string;
  zoneType: ZoneType;
}
function ZoneParamsForm({ zoneId, zoneType }: ZoneParamsFormProps) {
  const notImplementedYet = (
    <Flex>Oops! Sorry, {zoneType} form not implemented yet.</Flex>
  );
  switch (zoneType) {
    case ZoneType.Video:
      return (
        <ZoneSettingsForm
          zoneId={zoneId}
          formZoneType={ZoneType.Video}
          formEntries={VideoFormEntries}
        />
      );
    case ZoneType.Images:
      return notImplementedYet;
    case ZoneType.DynamicContent:
      return (
        <ZoneSettingsForm
          zoneId={zoneId}
          formZoneType={ZoneType.DynamicContent}
          formEntries={DynContentFormEntries}
          showHeaders={false}
        />
      );
    default:
      return notImplementedYet;
  }
}
