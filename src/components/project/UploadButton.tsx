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
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { setIsNew } from "../../features/zones/zonesSlice";
import { ReactS3Client } from "../../utils/s3Config";
import Dropzone from "../layout/Dropzone";
window.Buffer = window.Buffer || require("buffer").Buffer;

export default function UploadButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = React.useState<File>();
  const [fileName, setFileName] = React.useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <Button onClick={onOpen} size={"sm"}>
        Import an Artwork
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>Upload artwork</ModalHeader>
          <ModalBody>
            <Dropzone
              onDrop={React.useCallback((acceptedFiles: any) => {
                setFile(acceptedFiles[0]);
                setFileName(acceptedFiles[0].name);
              }, [])}
              content={
                fileName.length > 0
                  ? fileName
                  : "Drag and drop a file, or click to select file"
              }
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
                ReactS3Client.uploadFile(file)
                  .then((data: any) => {
                    onClose();
                    navigate(
                      `/figma?bytesimBucket=${
                        process.env.REACT_APP_S3_BUCKET
                      }&region=${
                        process.env.REACT_APP_S3_REGION
                      }&key=${encodeURIComponent(data.key)}&new=true`
                    );
                    setFile(undefined);
                    setFileName("");
                    dispatch(setIsNew(true));
                  })
                  .catch((err: any) => console.error("S3 upload err:", err));
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
