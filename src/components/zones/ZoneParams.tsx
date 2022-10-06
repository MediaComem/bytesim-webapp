import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { css } from "@emotion/css";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { Zone, ZoneType } from "../../app/types/types";
import { VideoParameters, VideoFormEntries } from "../../app/types/videoTypes";
import { zoneUpdated } from "../../features/zones/zonesSlice";
import AccordionChevron from "../layout/AccordionChevron";

interface ZoneParamsProps {
  zone: Zone;
}
export default function ZoneParams({ zone }: ZoneParamsProps) {
  const dispatch = useDispatch();
  const projectStatus = useAppSelector((state) => state.project.status);
  return (
    <Accordion allowToggle>
      {(Object.keys(ZoneType) as Array<keyof typeof ZoneType>).map((z, i) => {
        if (z === "Text") {
          return (
            <AccordionItem p={2} pl={6} display="flex" key={i} border="none">
              <Checkbox
                colorScheme={"brand"}
                isChecked={zone.zoneType === "Text"}
                mr={3}
                onChange={(e) => {
                  const newType = e.target.checked
                    ? (z as ZoneType)
                    : undefined;
                  dispatch(
                    zoneUpdated({
                      id: zone.id,
                      zoneType: newType,
                      params: undefined,
                    })
                  );
                }}
                isDisabled={projectStatus === "SIMULATION"}
              />
              <div
                className={
                  zone.zoneType !== z ? css({ opacity: 0.5 }) : undefined
                }
              >
                {z}
              </div>
            </AccordionItem>
          );
        } else {
          return (
            <AccordionItem key={i} border="none">
              {({ isExpanded }) => (
                <>
                  <Flex align="center">
                    <AccordionButton pl={6} pr={2} w={"auto"}>
                      <AccordionChevron isExpanded={isExpanded} />
                    </AccordionButton>
                    <div
                      className={
                        zone.zoneType !== z ? css({ opacity: 0.5 }) : undefined
                      }
                    >
                      {ZoneType[z]}
                    </div>
                  </Flex>
                  <AccordionPanel>
                    <ZoneParamsForm zoneId={zone.id} zoneType={z as ZoneType} />
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          );
        }
      })}
    </Accordion>
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
    case "Video":
      return <VideoForm zoneId={zoneId} />;
    case "Images":
      return notImplementedYet;
    default:
      return notImplementedYet;
  }
}

interface VideoFormProps {
  zoneId: string;
}
// TO DO after POC: make it abstract for all zone types
function VideoForm({ zoneId }: VideoFormProps) {
  const dispatch = useDispatch();
  const projectStatus = useAppSelector((state) => state.project.status);
  const zone = useAppSelector((state) =>
    state.zones.find((z) => z.id === zoneId)
  );
  const VideoZoneType = 'Video' as ZoneType;
  if (zone) {
    return (
      <Flex direction={"column"}>
        <div>
          {Object.entries(VideoFormEntries).map(([key, value]) => {
            return (
              <div key={key}>
                <Heading size="sm" my={2}>
                  {key}
                </Heading>
                <RadioGroup
                  value={
                    zone.params
                      ? zone.params[key as keyof VideoParameters]
                      : undefined
                  }
                  isDisabled={projectStatus === "SIMULATION"}
                >
                  <Stack>
                    {Object.values(value)
                      .filter((v) => typeof v !== "number")
                      .map((data, index) => (
                        <Radio
                          colorScheme={"brand"}
                          key={index}
                          value={data}
                          onChange={() => {
                            const newParams = {
                              id: zone.id,
                              params: { ...zone.params, [key]: data },
                              zoneType: VideoZoneType,
                            };
                            dispatch(zoneUpdated(newParams));
                          }}
                          size="sm"
                        >
                          {data}
                        </Radio>
                      ))}
                  </Stack>
                </RadioGroup>
              </div>
            );
          })}
        </div>
      </Flex>
    );
  } else {
    return <></>;
  }
}
