import { Accordion, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { css } from "@emotion/css";
import * as React from "react";
import { useDispatch } from "react-redux";
import { colorTheme } from ".";
import { useAppSelector, useCalculateAllRecommandations } from "./app/hooks";
import ConfirmModal from "./components/layout/ConfirmModal";
import Panel, { ResizablePanel } from "./components/layout/Panel";
import RecoReport from "./components/recommandations/RecoReport";
import MainGroupList from "./components/zones/MainGroupList";
import GeneralFormAccordion from "./components/zones/GeneralForm";
import ZonesList from "./components/zones/ZonesList";
import ZonesView from "./components/zones/ZonesView";
import { projectUpdated, projectReset } from "./features/project/projectSlice";
import { recommandationsPopulated } from "./features/recommandations/recommandationsSlice";
import { zoneAdded } from "./features/zones/zonesSlice";
import { ReactComponent as ResetIcon } from "./assets/ResetIcon_Active_MouseOver.svg";

export default function Home() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const state = useAppSelector((s) => s);
  const project = state.project;
  const recos = useCalculateAllRecommandations();

  const startSimulation = React.useCallback(() => {
    dispatch(projectUpdated({ status: "SIMULATION" }));
    dispatch(recommandationsPopulated(recos));
  }, [dispatch, projectUpdated, recos]);
  return (
    <Flex grow={1}>
      <Panel
        title="Report"
        className={css({
          minWidth: "22vw",
          maxWidth: "22vw",
          backgroundColor: colorTheme[50],
        })}
        id="report"
      >
        {project.status === "EDITING" && (
          <>
            <Text p={4} fontSize="sm" color={"gray.700"}>
              {
                "Welcome in this amazing tool to analyze the footprint of your website or app with an SVG. Let's do it and get good green recommendations! #happygreen"
              }
            </Text>
            <Button onClick={startSimulation}>Calculate</Button>
          </>
        )}
        {project.status === "SIMULATION" && (
          <>
            <RecoReport />
            <Button
              onClick={() => {
                dispatch(projectUpdated({ status: "EDITING" }));
              }}
              variant="outline"
            >
              Stop calculate
            </Button>
          </>
        )}
      </Panel>
      <Panel
        title="Parameters"
        grow={1}
        toolbarButton={
          <Button
            onClick={onOpen}
            size="sm"
            variant="ghost"
            disabled={project.status === "SIMULATION"}
          >
            Reset all <ResetIcon className={css({ margin: "3px" })} />
          </Button>
        }
        className={css({ borderLeft: 'none', borderRight: 'none' })}
      >
        <ConfirmModal
          headerText={"Reset the whole project"}
          message={
            "Are you sure you want to reset the whole project? It will delete all the provided data in general and all the zones."
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
          <MainGroupList />
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
            disabled={project.status === "SIMULATION"}
          >
            + Create Zone
          </Button>
        }
      >
        <ZonesView disableEdition={project.status === "SIMULATION"} />
      </ResizablePanel>
    </Flex>
  );
}
