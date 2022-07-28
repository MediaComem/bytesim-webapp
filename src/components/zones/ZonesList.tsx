import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import { ZoneType } from "../../app/types";
//import { PrettyZoneTypes } from "../../app/types";
import {
  zoneSelected,
  zoneDeleted,
  zoneUpdated,
} from "../../features/zones/zonesSlice";
import ZoneForm from "./ZoneForm";

export default function ZonesList() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const zones = useAppSelector((state) => state.zones);
  //const [expand, setExpand] = React.useState<boolean>(false);
  return (
    <Accordion allowToggle>
      {zones.map((z, i) => {
        return (
          <AccordionItem key={i} onClick={() => dispatch(zoneSelected(z.id))} >
            <Flex bg={z.status === "EDITING" ? "brand.100" : undefined} _hover={{ backgroundColor: "brand.100" }}>
              <AccordionButton
                flexWrap="nowrap"
                _hover={{ backgroundColor: "brand.100" }}
              >
                <AccordionIcon onClick={() => Collapse} />
                <Flex
                  flex="1"
                  align={"baseline"}
                  fontStyle={z.zoneType ? "normal" : "italic"}
                  gap={2}
                >
                  <Text whiteSpace="nowrap">{z.name}</Text>
                  {z.zoneType && (
                    <Text fontSize={"sm"} color={"gray"} whiteSpace="nowrap">
                      {Object.entries(ZoneType).find(s => s[0] === z.zoneType)?.[1]}
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
                    size='xs'
                    m={2}
                    minW={'fit-content'}
                  >
                    <div>menu</div>
                  </MenuButton>
                  <MenuList>
                    {z.zoneType && (
                      <MenuItem
                        onClick={() =>
                          dispatch(
                            zoneUpdated({ id: z.id, zoneType: undefined })
                          )
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
            <AccordionPanel pb={4}>
              <ZoneForm zone={z} />
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bg="blackAlpha.300" />
                <ModalContent>
                  <ModalHeader>Delete Zone</ModalHeader>
                  <ModalBody>
                    Are you sure you want to delete the Zone? It will delete the
                    assiciated form too.
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button
                      colorScheme={"red"}
                      variant="outline"
                      onClick={() => {
                        dispatch(zoneDeleted(z.id));
                        onClose();
                      }}
                    >
                      Delete zone
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
