import * as React from "react";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { ReactComponent as BestPracticesIcon } from "../../assets/BestPractices.svg";
import { Badge, Flex, Heading, Input } from "@chakra-ui/react";
import { useAppSelector } from "../../app/hooks";
import { useDispatch } from "react-redux";
import { setName } from "../../features/project/projectSlice";
import ButtonWithIconCustom from "./ButtonWithIconCustom";
import SaveProjectButton from "../project/SaveProjectButton";
import { useLocation, useNavigate } from "react-router-dom";
import UploadButton from "../project/UploadButton";
import { css } from "@emotion/css";

export default function BytesimeHeader() {
  const projectName = useAppSelector((state) => state.project.name);
  const [value, setValue] = React.useState(projectName);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  return (
    <Flex
      align="center"
      alignSelf="stretch"
      justify={"space-between"}
      borderBottom="2px"
      borderBottomColor="gray.200"
      id="header"
    >
      <Flex p={2} gap={4} align="center">
        <Flex align={"flex-end"} gap={2}>
          <Logo className={css({ height: "40px", width: "auto" })} />
          <div>
            <Badge colorScheme="orange" variant="outline" fontSize={"2xs"}>
              Beta
            </Badge>
            <Heading size={"md"}>ByteSim</Heading>
          </div>
        </Flex>
        <Heading size={"md"} fontWeight={"light"}>
          <Input
            variant={"flushed"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onBlur={() => dispatch(setName(value))}
            width="auto"
          />
        </Heading>
        <SaveProjectButton />
        <UploadButton />
      </Flex>
      <ButtonWithIconCustom
        icon={<BestPracticesIcon />}
        label={"Best practices"}
        variant={"ghost"}
        iconAfter={false}
        onClick={() => navigate(`./best-practices${search}`)}
      />
      {/* <ProjectSettingsModal /> */}
    </Flex>
  );
}
