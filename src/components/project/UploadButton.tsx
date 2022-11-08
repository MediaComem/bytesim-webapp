import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { projectUpdated } from "../../features/project/projectSlice";
import { ReactComponent as AddIcon } from "../../assets/BigPlus.svg";
import { colorTheme } from "../../theme";

export default function UploadButton() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = React.useState<string | undefined>();
  return (
    <>
      <Flex
        grow={1}
        direction={"column"}
        align="center"
        justifyContent={"center"}
        alignSelf="stretch"
        onClick={onOpen}
        _hover={{ backgroundColor: colorTheme[50], cursor: "pointer" }}
      >
        <Flex direction="column" align="center">
          <AddIcon />
          Import an Artwork
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>Upload artwork</ModalHeader>
          <ModalBody>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              cancel
            </Button>
            <Button
              variant="solid"
              colorScheme={"brand"}
              onClick={() => {
                const newScreenshot = {
                  screenshotBlob: file,
                };
                dispatch(projectUpdated(newScreenshot));
                onClose();
              }}
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
