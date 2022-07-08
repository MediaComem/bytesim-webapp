import "./App.css";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Resizable } from "re-resizable";
import { useAppSelector } from "./app/hooks";
import { cx, css } from "@emotion/css";
import TestSVG from "./components/TestSVG";

const panelStyle = css({
  border: "1px solid gray",
  padding: "5px",
});

const zoneStyle = css({
  border: "3px solid red",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

function App() {
  const projectName = useAppSelector((state) => state.project.name);
  // TEST DATA: add to store a list of zones, retrieve it
  // create hook to get only the one zone selected(being edited => status: EDITING)
  const zones = [{ id: '1', name: 'zone 1', x: 200, y: 80 }, { id: '2', name: 'zone 2', x: 120, y: 220 }];

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
          <Flex direction={'column'} h='100%'>
            <Flex p={3}>
              <Button onClick={() => {}}>+ Create Zone</Button>
            </Flex>
            <Flex align={"center"} justify={"center"} maxH='90%' pos={'relative'}>
              <TestSVG />
              {zones.map((z, i) => { return <Box key={i} h={'120px'} w={'135px'} pos={'absolute'} top={z.y} left={z.x} className={zoneStyle}>{z.name}</Box> })}
            </Flex>
            </Flex>
        </Resizable>
      </Flex>
    </div>
  );
}

export default App;
