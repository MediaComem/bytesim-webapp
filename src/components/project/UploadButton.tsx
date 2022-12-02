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

import { useNavigate } from "react-router-dom";
import { setIsNew } from "../../features/zones/zonesSlice";
import { ReactS3Client } from "../../utils/s3Config";
window.Buffer = window.Buffer || require("buffer").Buffer;

export default function UploadButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = React.useState<File>();
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
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  const newFile = e.target.files[0];
                  setFile(newFile);
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
                ReactS3Client.uploadFile(file)
                  .then((data: any) => {
                    onClose();
                    console.log("data", data);
                    navigate(
                      `/figma?bytesimBucket=${
                        process.env.REACT_APP_S3_BUCKET
                      }&region=${
                        process.env.REACT_APP_S3_REGION
                      }&key=${encodeURIComponent(data.key)}&new=true`
                    );
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
