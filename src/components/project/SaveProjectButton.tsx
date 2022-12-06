import { Button, useDisclosure } from "@chakra-ui/react";
import * as React from "react";
import CustomModal, { confirmText } from "../layout/CustomModal";

export default function SaveProjectButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        onClick={onOpen}
        size={'sm'}
        variant='outline'
      >
        Save project
      </Button>
      <CustomModal
        texts={confirmText.saveProject}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
