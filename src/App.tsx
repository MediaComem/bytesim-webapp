import "./App.css";
import { Button, Flex, Text } from "@chakra-ui/react";
import { css } from "@emotion/css";
import { useDispatch } from "react-redux";
import {
  zoneAdded,
} from "./features/zones/zonesSlice";
import Panel, { ResizablePanel } from "./components/layout/Panel";
import BytesimeHeader from "./components/layout/ByteSimHeader";
import ZonesList from "./components/zones/ZonesList";
import ZonesView from "./components/zones/ZonesView";
import GeneralFormAccordion from "./components/zones/GeneralForm";

function App() {
  const dispatch = useDispatch();
  return (
    <div className={"App " + css({ display: 'flex', flexDirection: 'column', height: "100vh" })}>
      <BytesimeHeader />
      <Flex grow={1}>
        <Panel title="Report" className={css({ maxWidth: "25vw" })}>
          <Text p={4} fontSize='sm' color={'gray.700'}>
            {
              "Welcome in this amazing tool to analyze the footprint of your website or app with an SVG. Let's do it and get good green recommendations! #happygreen"
            }
          </Text>
          {/* ReportToolBar */}
          {/* RecommandationsList */}
          {/* ExportButton */}
        </Panel>
        <Panel title="Parameters" grow={1}>
          <GeneralFormAccordion />
          <ZonesList />
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
              size='sm'
              colorScheme={'pink'}
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
