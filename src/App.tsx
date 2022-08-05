import "./App.css";
import { Accordion, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { css } from "@emotion/css";
import { useDispatch } from "react-redux";
import { zoneAdded } from "./features/zones/zonesSlice";
import Panel, { ResizablePanel } from "./components/layout/Panel";
import BytesimeHeader from "./components/layout/ByteSimHeader";
import ZonesList from "./components/zones/ZonesList";
import ZonesView from "./components/zones/ZonesView";
import GeneralFormAccordion from "./components/zones/GeneralForm";
import FigmaZonesList from "./components/zones/FigmaZonesList";
import ConfirmModal from "./components/layout/ConfirmModal";
import { projectReset } from "./features/project/projectSlice";
import { useAppSelector } from "./app/hooks";

function App() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const project = useAppSelector((state) => state.project);
  return (
    <div
      className={
        "App " +
        css({ display: "flex", flexDirection: "column", height: "100vh" })
      }
    >
      <BytesimeHeader />
      <Flex grow={1}>
        <Panel title="Report" className={css({ maxWidth: "25vw" })}>
          <Text p={4} fontSize="sm" color={"gray.700"}>
            {
              "Welcome in this amazing tool to analyze the footprint of your website or app with an SVG. Let's do it and get good green recommendations! #happygreen"
            }
          </Text>
          <div>
            <p>PROJECT: {project.name}</p>
            <p>{project.params?.nbVisit}</p>
            <p>{project.params?.server}</p>
            <p>{project.params?.plugins}</p>
            <p>{project.params?.genericFont}</p>
            <p>{project.params?.inifiteScroll}</p>
          </div>
          {/* ReportToolBar */}
          {/* RecommandationsList */}
          {/* ExportButton */}
        </Panel>
        <Panel
          title="Parameters"
          grow={1}
          toolbarButton={
            <Button onClick={onOpen} size="sm" variant="ghost">
              Reset all ⟳
            </Button>
          }
        >
          <ConfirmModal
            headerText={"Reset the whole project"}
            message={
              "Are you sur eyou want to reset the whole project? It will delete all the provided data in general and all the zones."
            }
            buttonLabel={"Reset project"}
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={() => {
              dispatch(projectReset());
              onClose();
            }}
          />
          <Accordion allowToggle>
            <GeneralFormAccordion />
            <FigmaZonesList />
            <ZonesList />
          </Accordion>
        </Panel>
        <ResizablePanel
          title="View"
          defaultHeight="100%"
          defaultWidth="50%"
          minWidth="20vw"
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
          toolbarButton={
            <Button
              onClick={() => {
                dispatch(zoneAdded());
              }}
              size="sm"
              colorScheme={"brand"}
            >
              + Create Zone
            </Button>
          }
        >
          <ZonesView />
        </ResizablePanel>
      </Flex>
    </div>
  );
}

export default App;
