import {
  Button,
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

export default function UploadButton() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = React.useState<string | undefined>();
  return (
    <>
      <Button onClick={onOpen}>Upoad new screenshot</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>Upload new screenshot</ModalHeader>
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
