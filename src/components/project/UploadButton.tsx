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
import { useDispatch } from "react-redux";
import shortId from "short-uuid";

import { useNavigate } from "react-router-dom";
import { setIsNew } from "../../features/zones/zonesSlice";
import { ReactComponent as ImportIcon } from "../../assets/Import.svg";
import Dropzone from "../layout/Dropzone";
import ButtonWithIconCustom from "../layout/ButtonWithIconCustom";
window.Buffer = window.Buffer || require("buffer").Buffer;

export default function UploadButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = React.useState<File>();
  const [fileName, setFileName] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <ButtonWithIconCustom
        icon={<ImportIcon />}
        label={"Import an Artwork"}
        variant={"ghost"}
        iconAfter={false}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>Upload artwork</ModalHeader>
          <ModalBody>
            <Dropzone
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
              onClick={async () => {
                // create file name with key and extension + ensure no special characters
                const fileNameParts = fileName.split(".");
                const key = `${shortId.generate()}_${fileNameParts[0].replace(
                  /[^a-zA-Z0-9 ]/g,
                  ""
                )}.${fileNameParts.pop()}`;
                const type = (file as File).type;
                // Generate a sign URL to upload to s3 bucket
                // Based on https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_presigned_post.html
                const response = await fetch(new URL(`${process.env.REACT_APP_S3_UPLOAD_URL_GENERATOR}?key=${key}&contentType=${encodeURIComponent(type)}`));
                const presigned = await response.json() as { uploadURL: string, fields: { [key: string] : string}};

                const fd = new FormData();
                for (const field in presigned.fields) {
                  fd.append(field, presigned.fields[field]);
                }
                fd.append("file", file as File);

                const data = await fetch(presigned.uploadURL, { method: "post", body: fd });
                if (data.ok) {
                  onClose();
                  navigate(
                    `/figma?key=${encodeURIComponent(key)}&new=true`
                  );
                  setFile(undefined);
                  setFileName("");
                  dispatch(setIsNew(true));
                } else {
                  setErrorMessage("Error while uploading the image");
                  console.log(data);
                }
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
