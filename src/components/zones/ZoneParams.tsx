import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  ExpandedIndex,
  Flex,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { Zone, ZoneType } from "../../app/types/types";
import { VideoParameters, VideoFormEntries } from "../../app/types/videoTypes";
import { zoneUpdated } from "../../features/zones/zonesSlice";
import AccordionChevron from "../layout/AccordionChevron";
import ConfirmModal from "../layout/ConfirmModal";

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
      return <VideoForm zoneId={zoneId} />;
    case ZoneType.Images:
      return notImplementedYet;
    case ZoneType.DynamicContent:
      return <DynContentForm />;
    default:
      return notImplementedYet;
  }
}

interface VideoFormProps {
  zoneId: string;
}
function VideoForm({ zoneId }: VideoFormProps) {
  const dispatch = useDispatch();
  const zone = useAppSelector((state) =>
    state.zones.find((z) => z.id === zoneId)
  );
  const VideoZoneType = "Video" as ZoneType;
  if (zone) {
    return (
      <Flex direction={"column"} pl={14}>
        <div>
          {Object.entries(VideoFormEntries).map(([key, value]) => {
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const newParams = {
                id: zone.id,
                params: { ...zone.params, [key]: e.target.value },
                zoneType: VideoZoneType,
              };
              dispatch(zoneUpdated(newParams));
            };

            return (
              <div key={key}>
                <Heading size="sm" mt={2} textTransform="capitalize">
                  {key}
                </Heading>
                <form>
                  {Object.values(value)
                    .filter((v) => typeof v !== "number")
                    .map((data, index) => {
                      const inputId = `${zone.id} ${key} ${data}`;
                      return (
                        <Flex key={index} gap={1} fontSize={"sm"}>
                          <input
                            type="radio"
                            name={data}
                            id={inputId}
                            value={data}
                            checked={
                              zone.params &&
                              zone.params[key as keyof VideoParameters] === data
                            }
                            onChange={handleChange}
                          />
                          <label htmlFor={inputId}>{data}</label>
                        </Flex>
                      );
                    })}
                </form>
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

function DynContentForm() {
  return (
    <div>
      <Flex direction="column" pl={14}>
        <div>
          <Checkbox /> Search
        </div>
        <div>
          <Checkbox /> Dynamic map
        </div>
        <div>
          <Checkbox /> Advertising
        </div>
        <div>
          <Checkbox /> Social network
        </div>
        <div>
          <Checkbox /> Comments box
        </div>
        <div>
          <Checkbox /> Recommendations
        </div>
        <div>
          <Checkbox /> 3D
        </div>
      </Flex>
    </div>
  );
}

/* function VideoForm({ zoneId }: VideoFormProps) {
  const dispatch = useDispatch();
  const projectStatus = useAppSelector((state) => state.project.status);
  const zone = useAppSelector((state) =>
    state.zones.find((z) => z.id === zoneId)
  );
  const VideoZoneType = "Video" as ZoneType;
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
} */
