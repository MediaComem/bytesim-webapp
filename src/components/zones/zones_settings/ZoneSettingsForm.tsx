import {
  Flex,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../app/hooks";
import { Zone, ZoneType } from "../../../app/types/types";
import { zoneUpdated } from "../../../features/zones/zonesSlice";
import CustomModal, { confirmText } from "../../layout/CustomModal";

interface VideoFormProps {
  zoneId: string;
  formZoneType: ZoneType;
  formEntries: { [key: string]: any };
  showHeaders?: boolean;
}

export default function ZoneSettingsFormWrapper({
  zoneId,
  formZoneType,
  formEntries,
  showHeaders = true,
}: VideoFormProps) {
  const zone = useAppSelector((state) =>
    state.zonesSlice.zones.find((z) => z.id === zoneId)
  );

  if (!zone) return <></>;
  return (
    <ZoneSettingsForm
      {...{
        zone,
        formZoneType,
        formEntries,
        showHeaders,
      }}
    />
  );
}
function ZoneSettingsForm({
  zone,
  formZoneType,
  formEntries,
  showHeaders = true,
}: Omit<VideoFormProps, "zoneId"> & { zone: Zone }) {
  //Match the current needs but may change in the futur
  const DEFAULT_NUMBER_INPUT: number = 1;
  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pendingKey, setPendingKey] = React.useState("");
  const [pendingValue, setPendingValue] = React.useState("");
  if (zone) {
    /**
     * Params with number values have a default one. Those values have to be
     * set by default in the zone params when selecting a type.
     * @returns default zone params as an object
     */
    const defaultZoneParams = () => {
      const inputsToAdd: { [key: string]: any } = {};
      Object.keys(formEntries).forEach((key) => {
        if (
          key in formEntries &&
          typeof formEntries[key] === "number" &&
          zone.params &&
          !Object.keys(zone.params).includes(key)
        ) {
          inputsToAdd[key] = DEFAULT_NUMBER_INPUT;
        }
      });
      return inputsToAdd;
    };
    const setParamValue = () => {
      const newParams: Partial<Zone> =
        zone.zoneType === formZoneType
          ? { params: zone.params }
          : { params: defaultZoneParams() };
      const newZone = {
        id: zone.id,
        params: {
          ...newParams.params,
          [pendingKey]: pendingValue,
        },
        zoneType: formZoneType,
      };
      dispatch(zoneUpdated(newZone));
    };
    useEffect(() => {
      if (pendingKey !== "") {
        if (zone.zoneType !== formZoneType && zone.zoneType !== undefined) {
          onOpen();
        } else {
          setParamValue();
        }
      }
    }, [pendingKey, pendingValue]);
    return (
      <Flex direction={"column"} pl={14} mt={-1} mb={-3}>
        <CustomModal
          texts={confirmText.changeZoneType}
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={() => {
            setParamValue();
            onClose();
          }}
        />
        <div>
          {Object.entries(formEntries).map(([key, value]) => {
            const handleValueChange = (value: string) => {
              setPendingKey(key);
              setPendingValue(value);
            };
            const handleEventChange = (
              e: React.ChangeEvent<HTMLInputElement>
            ) => {
              handleValueChange(e.target.value);
            };
            return (
              <div key={key}>
                {showHeaders ? (
                  <Heading
                    size="sm"
                    fontSize={12}
                    mt={2}
                    mb={1}
                    textTransform="capitalize"
                  >
                    {key}
                  </Heading>
                ) : (
                  <></>
                )}
                <form>
                  {typeof value === "number" ? (
                    <Flex gap={10} fontSize={"12px"}>
                      <NumberInput
                        size="sm"
                        id={`${zone.id} ${key}`}
                        value={
                          zone.params && zone.params[key] ? zone.params[key] : 1
                        }
                        min={1}
                        name={key as string}
                        onChange={handleValueChange}
                        onFocus={handleEventChange}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Flex>
                  ) : (
                    <></>
                  )}
                  {Object.values(value as object)
                    .filter((v) => typeof v !== "number")
                    .map((data, index) => {
                      const inputId = `${zone.id} ${key} ${data}`;
                      return (
                        <Flex key={index} gap={1} fontSize={"12px"}>
                          <input
                            type="radio"
                            name={data as string}
                            id={inputId}
                            value={data ?? ("" as string)}
                            checked={zone.params && zone.params[key] === data}
                            onChange={handleEventChange}
                          />
                          <label htmlFor={inputId}>{data as string}</label>
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
