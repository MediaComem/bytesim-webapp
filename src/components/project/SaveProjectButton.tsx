import { useDisclosure } from "@chakra-ui/react";
import * as React from "react";
import CustomModal, { confirmText } from "../layout/CustomModal";
import { ReactComponent as SaveIcon } from "../../assets/Save.svg";
import ButtonWithIconCustom from "../layout/ButtonWithIconCustom";

export default function SaveProjectButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <ButtonWithIconCustom
        icon={<SaveIcon />}
        label={"Save project"}
        variant={"ghost"}
        iconAfter={false}
        onClick={onOpen}
      />
      <CustomModal
        texts={confirmText.saveProject}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
