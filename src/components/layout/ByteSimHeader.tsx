import { Flex, Heading } from "@chakra-ui/react";
import { useAppSelector } from "../../app/hooks";
import ProjectSettingsModal from "../project/ProjectSettingsModal";

export default function BytesimeHeader() {
  const projectName = useAppSelector((state) => state.project.name);
  return (
    <Flex align="baseline" alignSelf="stretch" p={2} gap={1} justify={'space-between'}>
      <Flex gap={2}>
        <Heading size={"md"}>■ ByteSim</Heading>
        <Heading size={"md"} fontWeight={"light"}>
          {projectName}
        </Heading>
      </Flex>
      <ProjectSettingsModal />
    </Flex>
  );
}
