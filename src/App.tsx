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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Resizable } from "re-resizable";
import { useAppSelector } from "./app/hooks";
import { cx, css } from "@emotion/css";
import TestSVG from "./components/TestSVG";
import { useDispatch } from "react-redux";
import React from "react";
import { setName } from "./features/project/projectSlice";
import { Rnd } from "react-rnd";
import {
  zoneAdded,
  zoneDeleted,
  zoneSelected,
  zoneUpdated,
} from "./features/zones/zonesSlice";

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
  boxShadow: "0px 0px 5px 1px blue",
  fontWeight: "bold",
});

function App() {
  const projectName = useAppSelector((state) => state.project.name);
  const dispatch = useDispatch();
  const [projectNameI, setProjectNameI] = React.useState<string>(projectName);
  const zones = useAppSelector((state) => state.zones);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
                <AccordionItem key={i} onClick={() => dispatch(zoneSelected(z.id))}>
                  <h2>
                    <AccordionButton bg={z.status === "EDITING" ? 'gray.200' : undefined}>
                      <Box flex="1" textAlign="left">
                        {z.name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <div>STATUS: {z.status}</div>
                    <div>
                      SIZE: {z.width}x{z.height}
                    </div>
                    <div>
                      POSITION: left: {z.x}, top: {z.y}
                    </div>
                    <div>INDEX: {z.index}</div>
                    <Button colorScheme={'red'} variant="outline" onClick={onOpen}>Delete Zone</Button>
                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay bg='blackAlpha.300'/>
                      <ModalContent>
                        <ModalHeader>Delete Zone</ModalHeader>
                        <ModalBody>
                          Are you sure you want to delete the Zone? It will delete the assiciated form too.
                        </ModalBody>
                        <ModalFooter>
                          <Button variant="ghost" mr={3} onClick={onClose}>
                            Close
                          </Button>
                          <Button colorScheme={'red'} variant="outline" onClick={() => dispatch(zoneDeleted(z.id))} >Delete zone</Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
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
                  dispatch(zoneAdded());
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
              overflow={"auto"}
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
                    className={cx(zoneStyle, {
                      [selectedZoneStyle]: z.status === "EDITING",
                    })}
                    onMouseDown={() => dispatch(zoneSelected(z.id))}
                    enableResizing={z.status === "EDITING"}
                    onResizeStop={(e, direction, ref, delta, position) => {
                      const newZone = {
                        id: z.id,
                        x: position.x,
                        y: position.y,
                        width: z.width + delta.width,
                        height: z.height + delta.height,
                      };
                      dispatch(zoneUpdated(newZone));
                    }}
                    onDragStop={(e, d) => {
                      const newPos = {
                        id: z.id,
                        x: d.x,
                        y: d.y,
                      };
                      dispatch(zoneUpdated(newPos));
                    }}
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
