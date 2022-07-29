import {
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import * as React from "react";
import { useDispatch } from "react-redux";
import {
  StockVideoFormat,
  VideoFormEntries,
  Zone,
  ZoneType,
} from "../../app/types";
import { zoneUpdated } from "../../features/zones/zonesSlice";

interface ZoneParamsProps {
  zone: Zone;
}
export default function ZoneParams({ zone }: ZoneParamsProps) {
  const [value, setValue] = React.useState<ZoneType | undefined>(undefined);
  const [step, setStep] = React.useState<"TypeForm" | "ZoneForm">(
    zone.zoneType ? "ZoneForm" : "TypeForm"
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    setStep(zone.zoneType ? "ZoneForm" : "TypeForm");
  }, [zone.zoneType, setStep]);
  return (
    <Flex direction={"column"}>
      {step === "ZoneForm" && value ? (
        <>
          <ZoneForm zone={zone} />
        </>
      ) : (
        <>
          <TypeForm value={value} setValue={setValue} />
          <Button
            onClick={() => {
              dispatch(zoneUpdated({ id: zone.id, zoneType: value }));
              setStep("ZoneForm");
            }}
            isDisabled={!value}
          >
            Next
          </Button>
        </>
      )}
    </Flex>
  );
}
interface TypeProps {
  value: ZoneType | undefined;
  setValue: React.Dispatch<React.SetStateAction<ZoneType | undefined>>;
}
function TypeForm({ value, setValue }: TypeProps) {
  return (
    <RadioGroup value={value}>
      <Stack>
        {(Object.keys(ZoneType) as Array<keyof typeof ZoneType>).map((z) => (
          <Radio
            colorScheme={"brand"}
            key={z}
            value={z}
            onChange={() => setValue(z as ZoneType)}
          >
            {ZoneType[z]}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
}
interface ZoneFormProps {
  zone: Zone;
}
function ZoneForm({ zone }: ZoneFormProps) {
  const notImplementedYet = <Flex>Oops! Sorry, {zone.zoneType} form not implemented yet.</Flex>;
  switch (zone.zoneType) {
    case 'Video':
      return (<VideoForm zone={zone} />);
    case 'Images':
      return (notImplementedYet);
    case 'Text':
      return (notImplementedYet);
    default:
      return (notImplementedYet);
  }
}

function VideoForm({ zone }: ZoneFormProps) {
  const dispatch = useDispatch();
  console.log(zone.params);
  return (
    <Flex direction={"column"}>
      <div>
        {Object.entries(VideoFormEntries).map(([key, value]) => {
          //const entryName = entry[0];
          //console.log(value ? value[entryName] : undefined);
          return (
            <div key={key}>
              <Heading size="sm">{key}</Heading>
              <RadioGroup
                value={ zone.params ? Number(zone.params[key as keyof StockVideoFormat]) : undefined }
              >
                <Stack>
                  {Object.values(value).map((data, index) => (
                    <Radio
                      colorScheme={"brand"}
                      key={index}
                      value={index}
                      onChange={() => {
                        const newPos = {
                          id: zone.id,
                          params: { ...zone.params, [key]: index }
                        };
                        dispatch(zoneUpdated(newPos));
                      }}
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

// ARCHIVES: work on form with enums as forms types.
/* <RadioGroup value={
                //value[entry[0]] ? value[entry[1]] :
                2}>
                <Stack>
                  {Object.entries(entry[1])
                    .filter((e) => isNaN(Number(e)))
                    .map((x, i) => {
                      return (
                        <Radio
                          colorScheme={"brand"}
                          key={i}
                          value={Number(x[0])}
                          onChange={() =>
                            setValue({
                              format: 0,
                              quality: 0,
                              durationMin: 0,
                              autoplay: 0,
                              loop: 0,
                            })
                          }
                        >
                          {x}
                        </Radio>
                      );
                    })}
                </Stack>
              </RadioGroup> */
/* <div>
                {Object.keys(entry[1])
                  .filter((e) => isNaN(Number(e)))
                  .map((x, i) => {
                    return <div key={i}>{x}</div>;
                  })}
              </div> */
