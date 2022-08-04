import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import * as React from 'react';

interface ConfirmModalProps {
headerText: string;
message: string | React.ReactNode;
buttonLabel: string;
confrimeButtonClassName?: string;
isOpen: boolean;
onClose: () => void;
onConfirm: () => void;
}
export default function ConfirmModal({ headerText, message, buttonLabel, isOpen, onClose, onConfirm }:ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" />
      <ModalContent>
        <ModalHeader>{headerText}</ModalHeader>
        <ModalBody>
          {message}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme={"red"}
            variant="outline"
            onClick={onConfirm}
            /* onClick={() => {
              dispatch(zoneDeleted(z.id));
              onClose();
            }} */
          >
            {buttonLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
