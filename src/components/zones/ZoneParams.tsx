import {
  Accordion,
  AccordionButton,
  AccordionIcon,
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
import { Zone, ZoneType } from "../../app/types/types";
import { VideoParameters, VideoFormEntries } from "../../app/types/videoTypes";
import { zoneUpdated } from "../../features/zones/zonesSlice";

interface ZoneParamsProps {
  zone: Zone;
}
export default function ZoneParams({ zone }: ZoneParamsProps) {
  const dispatch = useDispatch();
  return (
    <Accordion allowToggle>
      {(Object.keys(ZoneType) as Array<keyof typeof ZoneType>).map((z) => {
        if (z === "Text") {
          return (
            <AccordionItem p={2} pl={6} display='flex' key={z}>
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
            <AccordionItem key={z}>
              <Flex align="center">
                <AccordionButton
                  pl={6}
                  pr={2}
                  w={"auto"}
                >
                  <AccordionIcon />
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
                <ZoneParamsForm zone={zone} zoneType={z as ZoneType} />
              </AccordionPanel>
            </AccordionItem>
          );
        }
      })}
    </Accordion>
  );
}

interface ZoneParamsFormProps {
  zone: Zone;
  zoneType: ZoneType;
}
function ZoneParamsForm({ zone, zoneType }: ZoneParamsFormProps) {
  const notImplementedYet = (
    <Flex>Oops! Sorry, {zoneType} form not implemented yet.</Flex>
  );
  switch (zoneType) {
    case "Video":
      return <VideoForm zone={zone} zoneType={zoneType} />;
    case "Images":
      return notImplementedYet;
    default:
      return notImplementedYet;
  }
}

// TO DO after POC: make it abstract for all zone types
function VideoForm({ zone, zoneType }: ZoneParamsFormProps) {
  const dispatch = useDispatch();
  return (
    <Flex direction={"column"}>
      <div>
        {Object.entries(VideoFormEntries).map(([key, value]) => {
          return (
            <div key={key}>
              <Heading size="sm" my={2}>{key}</Heading>
              <RadioGroup
                value={
                  zone.params
                    ? zone.params[key as keyof VideoParameters]
                    : undefined
                }
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
                            zoneType: zone.zoneType,
                          };
                          if (zoneType !== zone.zoneType) {
                            newParams.zoneType = zoneType;
                          }
                          dispatch(zoneUpdated(newParams));
                        }}
                        size='sm'
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
}
