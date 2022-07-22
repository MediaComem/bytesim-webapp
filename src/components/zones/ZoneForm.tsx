import { Button, Flex, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { PrettyZoneTypes, Zone, ZoneType, zoneTypes } from "../../app/types";
import { zoneUpdated } from "../../features/zones/zonesSlice";

interface ZoneFormProps {
  zone: Zone;
}
export default function ZoneParams({ zone }: ZoneFormProps) {
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
      {step === "TypeForm" ? (
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
      ) : (
        <ZoneForm />
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
        {zoneTypes.map((z) => (
          <Radio
            colorScheme={"brand"}
            key={z}
            value={z}
            onChange={() => setValue(z)}
          >
            {PrettyZoneTypes(z)}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
}

function ZoneForm() {
  return (<Flex>
    Oops! Sorry, not implemented yet
  </Flex>);
}
