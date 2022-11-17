import * as React from "react";
import { Badge, Flex, Heading, Input, Spinner } from "@chakra-ui/react";
import { useCurrentProject } from "../../app/hooks";
import { useDispatch } from "react-redux";
import { projectUpdated } from "../../features/project/projectsSlice";
import ButtonWithIconCustom from "./ButtonWithIconCustom";
import NewProjectButton from "../project/NewProjectButton";

export default function BytesimeHeader() {
  const currentProject = useCurrentProject();
  const projectName = currentProject ? currentProject.name : "Undefined";
  const [value, setValue] = React.useState(projectName);
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (!currentProject) return;
    setValue(currentProject.name);
  }, [currentProject]);
  if (currentProject) {
    return (
      <Flex
        align="center"
        alignSelf="stretch"
        justify={"space-between"}
        borderBottom="1px solid lightgray"
        id="header"
      >
        <Flex p={2} gap={2} align="center">
          <Heading size={"md"}>
            ■ ByteSim{" "}
            <Badge colorScheme="yellow" variant="outline">
              Version alpha
            </Badge>
          </Heading>
          <Heading size={"md"} fontWeight={"light"}>
            <Input
              variant={"flushed"}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              onBlur={() =>
                dispatch(
                  projectUpdated({ id: currentProject.id, name: value })
                )
              }
              width="auto"
            />
          </Heading>
          <NewProjectButton />
        </Flex>
        <ButtonWithIconCustom
          icon={<></>}
          label={"Best practices"}
          //subLabel={"Start with ByteSim"}
          variant={"ghost"}
          iconAfter
        />
        {/* <ProjectSettingsModal /> */}
      </Flex>
    );
  } else {
    return <Spinner />;
  }
}
