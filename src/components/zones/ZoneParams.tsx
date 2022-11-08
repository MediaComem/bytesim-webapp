import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
} from "@chakra-ui/react";
import { Zone, ZoneFigma, ZoneType } from "../../app/types/types";
import { VideoFormEntries } from "../../app/types/videoTypes";
import { DynContentFormEntries } from "../../app/types/dynContentTypes";
import { ImageFormEntries } from "../../app/types/imgTypes";
import AccordionChevron from "../layout/AccordionChevron";
//import ConfirmModal, { confirmText } from "../layout/ConfirmModal";
import ZoneSettingsForm from "./zones_settings/ZoneSettingsForm";

interface ZoneParamsProps {
  zone: Zone | ZoneFigma;
}
export default function ZoneParams({ zone }: ZoneParamsProps) {
  const defaultIndex = Object.keys(ZoneType).indexOf(zone.zoneType!);
  return (
    <>
      <Accordion allowToggle defaultIndex={[defaultIndex]}>
        {(Object.keys(ZoneType) as Array<keyof typeof ZoneType>).map((z, i) => {
          return (
            <AccordionItem key={`${z}_${i}`} border="none">
              {({ isExpanded }) => (
                <>
                  <Flex align="center">
                    <AccordionButton pl={12} pr={2} w={"auto"}>
                      <AccordionChevron isExpanded={isExpanded} />
                    </AccordionButton>
                    <div>{ZoneType[z]}</div>
                  </Flex>
                  <AccordionPanel>
                    <ZoneParamsForm zoneId={zone.id} zoneType={z as ZoneType} />
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
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
      return (
        <ZoneSettingsForm
          zoneId={zoneId}
          formZoneType={ZoneType.Images}
          formEntries={ImageFormEntries}
        />
      );
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
