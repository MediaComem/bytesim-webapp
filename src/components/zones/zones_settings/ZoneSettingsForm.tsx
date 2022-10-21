import { Flex, Heading } from "@chakra-ui/react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../app/hooks";
import { Zone, ZoneType } from "../../../app/types/types";
import { zoneUpdated } from "../../../features/zones/zonesSlice";

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
  if (zone) {
    return (
      <Flex direction={"column"} pl={14}>
        <div>
          {Object.entries(formEntries).map(([key, value]) => {
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              //remove params from other types
              const newParams: Partial<Zone> =
                zone.zoneType === formZoneType
                  ? { params: zone.params }
                  : { params: {} };
              const newZone = {
                id: zone.id,
                params: { ...newParams.params, [key]: e.target.value },
                zoneType: formZoneType,
              };
              dispatch(zoneUpdated(newZone));
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
                    .map((data, index) => (
                      <Flex key={index} gap={1} fontSize={"sm"}>
                        <input
                          type="radio"
                          name={data as string}
                          id={key + data}
                          value={data as string}
                          checked={zone.params && zone.params[key] === data}
                          onChange={handleChange}
                        />
                        <label htmlFor={key + data}>{data as string}</label>
                      </Flex>
                    ))}
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
