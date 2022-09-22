import * as React from "react";
import { Flex, Heading, Input } from "@chakra-ui/react";
import { useAppSelector } from "../../app/hooks";
import { useDispatch } from "react-redux";
import { setName } from "../../features/project/projectSlice";

export default function BytesimeHeader() {
  const projectName = useAppSelector((state) => state.project.name);
  const [value, setValue] = React.useState(projectName);
  const dispatch = useDispatch();
  return (
    <Flex
      align="baseline"
      alignSelf="stretch"
      p={2}
      gap={1}
      justify={"space-between"}
      id="header"
    >
      <Flex gap={2} align='center'>
        <Heading size={"md"}>■ ByteSim</Heading>
        <Heading size={"md"} fontWeight={"light"}>
          <Input
          variant={"unstyled"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onBlur={() => dispatch(setName(value))}
            width='auto'
          />
        </Heading>
      </Flex>
      {/* <ProjectSettingsModal /> */}
    </Flex>
  );
}
