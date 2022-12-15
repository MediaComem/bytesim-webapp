import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import ImportProjectDropZone from "../layout/ImportProjectDropZone";
window.Buffer = window.Buffer || require("buffer").Buffer;

export default function ImportProjectButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = React.useState<File>();
  const [fileName, setFileName] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
    function importFromJson(e: React.MouseEvent) {
      e.preventDefault()
      if (file) {
      const exampleFileReader = new FileReader()
      exampleFileReader.onload = async (e) => {
        const text = (e.target?.result)
        console.log(text);
        console.log(JSON.parse(JSON.stringify(text)));
        localStorage.setItem('redux', JSON.stringify(text));
        //window.location.reload();
      };
      exampleFileReader.readAsText(file);
    }
    }
  return (
    <>
      <Button onClick={onOpen} size={"sm"} variant="outline">
        Import a project
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>Import project</ModalHeader>
          <ModalBody>
            <ImportProjectDropZone
              onDrop={React.useCallback((acceptedFiles: any) => {
                setErrorMessage("");
                setFile(acceptedFiles[0]);
                setFileName(acceptedFiles[0]?.name);
              }, [])}
              content={
                fileName && fileName.length > 0
                  ? fileName
                  : "Drag and drop a file, or click to select file"
              }
            />
            {errorMessage ? <Text color="red.600">{errorMessage}</Text> : null}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              cancel
            </Button>
            <Button
              variant="solid"
              colorScheme={"brand"}
              onClick={importFromJson}
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
