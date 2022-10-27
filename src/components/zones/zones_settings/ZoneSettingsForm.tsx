import { Flex, Heading, useDisclosure } from "@chakra-ui/react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../app/hooks";
import { Zone, ZoneType } from "../../../app/types/types";
import { zoneUpdated } from "../../../features/zones/zonesSlice";
import ConfirmModal from "../../layout/ConfirmModal";

interface VideoFormProps {
  zoneId: string;
  formZoneType: ZoneType;
  formEntries: object;
  showHeaders?: boolean;
}
export default function ZoneSettingsForm({
  zoneId,
  formZoneType,
  formEntries,
  showHeaders = true,
}: VideoFormProps) {
  const dispatch = useDispatch();
  const zone = useAppSelector((state) =>
    state.zones.find((z) => z.id === zoneId)
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pendingKey, setPendingKey] = React.useState("");
  const [pendingValue, setPendingValue] = React.useState("");
  if (zone) {
    const setParamValue = () => {
      const newParams: Partial<Zone> =
        zone.zoneType === formZoneType
          ? { params: zone.params }
          : { params: {} };
      const newZone = {
        id: zone.id,
        params: { ...newParams.params, [pendingKey]: pendingValue },
        zoneType: formZoneType,
      };
      dispatch(zoneUpdated(newZone));
    };
    React.useEffect(() => {
      if (pendingKey !== "") {
        if (zone.zoneType !== formZoneType && zone.zoneType !== undefined) {
          onOpen();
        } else {
          setParamValue();
        }
      }
    }, [pendingKey, pendingValue]);
    return (
      <Flex direction={"column"} pl={14}>
        <ConfirmModal
          headerText={"Change zone type"}
          message={`Are you sure you want to change the type of ${zone.name}? It will delete all the provided data in other type.`}
          buttonLabel={"Change type"}
          isOpen={isOpen}
          onClose={() => {
            setPendingKey("");
            setPendingValue("");
            onClose();
          }}
          onConfirm={() => {
            setParamValue();
            onClose();
          }}
        />
        <div>
          {Object.entries(formEntries).map(([key, value]) => {
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              //remove params from other types
              setPendingKey(key);
              setPendingValue(e.target.value);
            };
            return (
              <div key={key}>
                {showHeaders ? (
                  <Heading size="sm" mt={2} textTransform="capitalize">
                    {key}
                  </Heading>
                ) : (
                  <></>
                )}
                <form>
                  {Object.values(value as object)
                    .filter((v) => typeof v !== "number")
                    .map((data, index) => {
                      const inputId = `${zone.id} ${key} ${data}`;
                      return (
                        <Flex key={index} gap={1} fontSize={"sm"}>
                          <input
                            type="radio"
                            name={data as string}
                            id={inputId}
                            value={data as string}
                            checked={zone.params && zone.params[key] === data}
                            onChange={handleChange}
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
