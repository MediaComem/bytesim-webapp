import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  useDisclosure,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Collapse,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { Zone, ZoneType } from "../../app/types/types";
//import { PrettyZoneTypes } from "../../app/types";
import {
  zoneSelected,
  zoneDeleted,
  zoneUpdated,
} from "../../features/zones/zonesSlice";
import ConfirmModal from "../layout/ConfirmModal";
import ZoneParams from "./ZoneParams";

export default function ZonesList() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const zones = useAppSelector((state) => state.zones);
  return (
    <Accordion allowToggle>
      {zones.map((z, i) => {
        return (
          <AccordionItem key={i} onClick={() => dispatch(zoneSelected(z.id))}>
            <ZoneListButton zone={z} onOpen={onOpen} />
            <AccordionPanel pb={4}>
              <ZoneParams zone={z} />
            </AccordionPanel>
            <ConfirmModal
              message={
                "Are you sure you want to delete the Zone? It will delete the associated form too."
              }
              buttonLabel={"Delete Zone"}
              isOpen={isOpen}
              onClose={onClose}
              onConfirm={() => {
                dispatch(zoneDeleted(z.id));
                onClose();
              }}
            />
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

interface ZoneListButtonProps {
  zone: Zone;
  onOpen: () => void;
}
function ZoneListButton({ zone, onOpen }: ZoneListButtonProps) {
  const dispatch = useDispatch();
  return (
    <Flex
      bg={zone.status === "EDITING" ? "brand.100" : undefined}
      _hover={{ backgroundColor: "brand.100" }}
    >
      <AccordionButton
        flexWrap="nowrap"
        _hover={{ backgroundColor: "brand.100" }}
      >
        <AccordionIcon onClick={() => Collapse} />
        <Flex
          flex="1"
          align={"baseline"}
          fontStyle={zone.zoneType ? "normal" : "italic"}
          gap={2}
        >
          <Text whiteSpace="nowrap">{zone.name}</Text>
          {zone.zoneType && (
            <Text fontSize={"sm"} color={"gray"} whiteSpace="nowrap">
              {
                Object.entries(ZoneType).find(
                  (s) => s[0] === zone.zoneType
                )?.[1]
              }
            </Text>
          )}
        </Flex>
      </AccordionButton>
      <Menu>
        <MenuButton
          as={Button}
          aria-label="Options"
          colorScheme={"brand"}
          variant="outline"
          fontSize={"xs"}
          size="xs"
          m={2}
          minW={"fit-content"}
        >
          <div>menu</div>
        </MenuButton>
        <MenuList>
          {zone.zoneType && (
            <MenuItem
              onClick={() =>
                dispatch(zoneUpdated({ id: zone.id, zoneType: undefined }))
              }
            >
              Change Type
            </MenuItem>
          )}

          <MenuItem color={"red"} onClick={onOpen}>
            Delete zone
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
