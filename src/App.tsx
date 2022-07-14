import "./App.css";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { Resizable } from "re-resizable";
import { useAppSelector } from "./app/hooks";
import { cx, css } from "@emotion/css";
import TestSVG from "./components/TestSVG";
import { useDispatch } from "react-redux";
import React from "react";
import { setName } from "./features/project/projectSlice";
import { Rnd } from "react-rnd";
import { nanoid } from "@reduxjs/toolkit";
import { zoneAdded, zoneDeleted, zoneSelected } from "./features/zones/zonesSlice";

const panelStyle = css({
  border: "1px solid gray",
  padding: "5px",
});

const zoneStyle = css({
  border: "3px solid red",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const selectedZoneStyle = css({
  border: "3px solid blue",
  boxShadow: '0px 0px 5px 1px blue',
  fontWeight: 'bold',
});

function App() {
  const projectName = useAppSelector((state) => state.project.name);
  const dispatch = useDispatch();
  const [projectNameI, setProjectNameI] = React.useState<string>(projectName);
  const zones = useAppSelector((state) => state.zones);

  return (
    <div className="App">
      <Flex className={css({ height: "100vh" })}>
        <Flex
          flexDirection={"column"}
          className={cx(panelStyle, css({ maxWidth: "25vw" }))}
          alignSelf="stretch"
        >
          <Flex
            p={3}
            direction="column"
            borderBottom="1px"
            borderColor="gray.200"
          >
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
          <Input
            value={projectNameI}
            onChange={(e) => setProjectNameI(e.target.value)}
          />
          <Button onClick={() => dispatch(setName(projectNameI))}>
            Update
          </Button>
          <Accordion allowToggle>
            {zones.map((z, i) => {
              return (
                <AccordionItem key={i}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {z.name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <div>STATUS: {z.status}</div>
                    <div>SIZE: {z.width}x{z.height}</div>
                    <div>POSITION: left: {z.x}, top: {z.y}</div>
                    <Button colorScheme={'red'} variant={'outline'} onClick={() => dispatch(zoneDeleted(z.id))}>Delete zone</Button>
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
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
          <Flex direction={"column"} h="100%">
            <Flex p={3}>
              <Button
                onClick={() => {
                  dispatch(zoneAdded({
                    id: nanoid(),
                    x: 100,
                    y: 100,
                    width: '100px',
                    height: '100px',
                    index: 1,
                    name: `Zone ${zones.length + 1}`,
                    status: "ACTIVE",
                }));
                }}
              >
                + Create Zone
              </Button>
            </Flex>
            <Flex
              align={"flex-start"}
              justify={"flex-start"}
              pos={"relative"}
              p={10}
              overflow={'auto'}
              grow={1}
            >
              <div>
              <TestSVG />
              </div>
              {zones.map((z, i) => {
                return (
                  <Rnd
                    key={z.id}
                    default={{
                      x: z.x,
                      y: z.y,
                      width: z.width,
                      height: z.height,
                    }}
                    className={cx(zoneStyle, { [selectedZoneStyle]: z.status === "EDITING" })}
                    onMouseDown={() => dispatch(zoneSelected(z.id))}
                    enableResizing={z.status === "EDITING"}
                  >
                    {z.name}
                  </Rnd>
                );
              })}
            </Flex>
          </Flex>
        </Resizable>
      </Flex>
    </div>
  );
}

export default App;
