import "./App.css";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Resizable } from "re-resizable";
import { useAppSelector } from "./app/hooks";
import { cx, css } from "@emotion/css";
import TestSVG from "./components/TestSVG";

const panelStyle = css({
  border: "1px solid gray",
  padding: "5px",
});

function App() {
  const projectName = useAppSelector((state) => state.project.name);

  return (
    <div className="App">
      <Flex className={css({ height: "100vh" })}>
        <Flex
          flexDirection={"column"}
          className={cx(panelStyle, css({ maxWidth: "250px" }))}
          alignSelf="stretch"
        >
          <Flex p={3} direction="column" borderBottom='1px' borderColor='gray.200'>
            <Heading>ByteSim</Heading>
            <Heading size="sm">{projectName}</Heading>
          </Flex>
          <Text>
            {
              "Welcome in this amazing tool to analyze the footprint of your website or app with an SVG. Let's do it and get good green recommendations! #happygreen"
            }
          </Text>
        </Flex>
        <Flex flexDirection={"column"} className={panelStyle} grow={1}>
          Dynamic Form
        </Flex>
        <Resizable
          defaultSize={{
            width: "50%",
            height: "100%",
          }}
          minWidth={150}
          enable={{
            top: false,
            right: false,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
        >
          <Flex direction={"column"} align={"stretch"}>
            <Flex p={3}>
              <Button onClick={() => {}}>+ Create Zone</Button>
            </Flex>
            <Flex align={"center"} justify={"center"}>
              <TestSVG />
            </Flex>
          </Flex>
        </Resizable>
      </Flex>
    </div>
  );
}

export default App;
