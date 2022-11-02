import { Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
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
      <Text fontSize="sm" color="tomato">
        Some zones are not complete and therefore not taken into account in the
        the calculation:
        <UnorderedList spacing={10}>
          {uncompleteZoneNames.map((name, index) => (
            <ListItem key={index}>{name}</ListItem>
          ))}
        </UnorderedList>
      </Text>
    </Flex>
  );
}
