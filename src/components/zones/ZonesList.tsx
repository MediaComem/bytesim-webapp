import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { zoneSelected, zoneDeleted } from "../../features/zones/zonesSlice";
import TypeForm from "./TypeForm";

export default function ZonesList() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const zones = useAppSelector((state) => state.zones);
  return (
    <Accordion allowToggle>
      {zones.map((z, i) => {
        return (
          <AccordionItem key={i} onClick={() => dispatch(zoneSelected(z.id))}>
            <h2>
              <AccordionButton
                bg={z.status === "EDITING" ? "brand.100" : undefined}
                _hover={{ backgroundColor: "brand.100" }}
              >
                <Box flex="1" textAlign="left">
                  {z.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <TypeForm />
              <div>STATUS: {z.status}</div>
              <div>
                SIZE: {z.width}x{z.height}
              </div>
              <div>
                POSITION: left: {z.x}, top: {z.y}
              </div>
              <div>INDEX: {z.index}</div>
              <Button colorScheme={"red"} variant="outline" onClick={onOpen}>
                Delete Zone
              </Button>
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
