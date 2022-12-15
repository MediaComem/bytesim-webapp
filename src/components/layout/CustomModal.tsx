import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import * as React from "react";
import ExportProjectButton from "../project/ExportProjectButton";

export interface ModalParams {
  title: string;
  text: string | React.ReactNode;
  cancelButtonText?: string;
  confirmButtonText?: string;
}
export const confirmText: Record<string, ModalParams> = {
  resetProject: {
    title: "Reset the whole project",
    text: "Are you sure you want to reset the whole project? It will delete all the provided data in general and all the zones.",
    confirmButtonText: "Reset project",
  },
  resetGeneral: {
    title: "Reset general form",
    text: "Are you sure you want to reset the general from? It will delete all the provided data in it.",
    confirmButtonText: "Reset general form",
  },
  resetAllZones: {
    title: "Reset all zones",
    text: "Are you sure you want to reset all zones? It will delete all provided data.",
    confirmButtonText: "Reset all zones",
  },
  deleteAllZones: {
    title: "Delete all zones",
    text: "Are you sure you want to delete all zones? It will delete all drawn zones on the view panel and all data.",
    confirmButtonText: "Delete all zones",
  },
  deleteZone: {
    title: "Delete zone",
    text: "Are you sure you want to delete the zone? It will delete the associated form too.",
    confirmButtonText: "Delete zone",
  },
  resetZone: {
    title: "Reset zone",
    text: "Are you sure you want to reset the zone? It will delete the associated form too.",
    confirmButtonText: "Reset zone",
  },
  changeZoneType: {
    title: "Change zone type",
    text: "Are you sure you want to change the type of the zone? It will delete all the provided data in other type.",
    confirmButtonText: "Change type",
  },
  saveProject: {
    title: "Save project",
    text: <><p>In this beta version, your project is only saved in your cache. To save your project, keep this link as favorite and do not empty your cache.</p><p>Export the project data</p><ExportProjectButton /></>,
    cancelButtonText: "OK",
  },
};

interface CustomModalProps {
  texts: ModalParams;
  confirmButtonClassName?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}
export default function CustomModal({
  texts,
  confirmButtonClassName,
  isOpen,
  onClose,
  onConfirm,
}: CustomModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" />
      <ModalContent>
        <ModalHeader>{texts.title}</ModalHeader>
        <ModalBody>{texts.text}</ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {texts.cancelButtonText ? texts.cancelButtonText : "cancel"}
          </Button>
          {onConfirm && (
            <Button
              colorScheme={"red"}
              variant="outline"
              onClick={onConfirm}
              className={confirmButtonClassName}
            >
              {texts.confirmButtonText ? texts.confirmButtonText : "OK"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
