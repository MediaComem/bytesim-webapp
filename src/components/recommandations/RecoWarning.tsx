import { Flex, Text } from "@chakra-ui/react";
import { ReactComponent as WarningIcon } from "../../assets/Warning.svg";
import * as React from "react";

interface RecoWarningProps {
  uncompleteZoneNames: Array<string>;
}
export default function RecoWarning({ uncompleteZoneNames }: RecoWarningProps) {
  /* const zonesParams = useAppSelector((state) => {
    return Object.values(state.zones).filter((zone) => zone.filter());
  }); */
  return (
    <Flex align={"center"} p={2}>
      <Text>
        <WarningIcon></WarningIcon>
      </Text>
      <Text fontSize="sm" ml={2} color="tomato">
        Uncomplete zones are not taken into account in the the
        calculation:&nbsp;
        <Text as="b">
          {uncompleteZoneNames.map((name, index) =>
            index ? `, ${name}` : name
          )}
        </Text>
      </Text>
    </Flex>
  );
}
