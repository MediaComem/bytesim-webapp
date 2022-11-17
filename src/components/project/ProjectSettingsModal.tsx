import {
  Button,
  Input,
  Text,
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
import { useCurrentProject } from "../../app/hooks";
import { projectUpdated } from "../../features/project/projectsSlice";

export default function ProjectSettingsModal() {
  const dispatch = useDispatch();
  const currentProject = useCurrentProject();
  const projectName = currentProject ? currentProject.name : 'Undefined';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projectNameI, setProjectNameI] = React.useState<string>(projectName);
  return (
    <>
      <Button size="sm" onClick={onOpen} variant="outline" colorScheme={'brand'}>
        settings
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>Project settings</ModalHeader>
          <ModalBody>
            <Text mb={1} color='gray.500' fontSize={'sm'}>Project name</Text>
            <Input
              value={projectNameI}
              onChange={(e) => setProjectNameI(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => dispatch(projectUpdated({ name: projectNameI }))}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
