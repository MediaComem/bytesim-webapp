import { Accordion, Button, Flex, useDisclosure } from "@chakra-ui/react";
import { css } from "@emotion/css";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./app/hooks";
import ConfirmModal from "./components/layout/ConfirmModal";
import Panel, { ResizablePanel } from "./components/layout/Panel";
import RecoReport from "./components/recommandations/RecoReport";
import MainGroupList from "./components/zones/MainGroupList";
import GeneralFormAccordion from "./components/zones/GeneralForm";
import ZonesList from "./components/zones/ZonesList";
import ZonesView from "./components/zones/ZonesView";
import { projectReset } from "./features/project/projectSlice";
import { allZonesReset, zoneAdded } from "./features/zones/zonesSlice";
import { ReactComponent as ResetIcon } from "./assets/ResetIcon_Active_MouseOver.svg";
import ExportButton from "./components/recommandations/ExportButton";
import { useNavigate } from "react-router-dom";
import { colorTheme } from "./theme";

export default function Home() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const state = useAppSelector((s) => s);
  const project = state.project;
  const navigate = useNavigate();
  return (
    <Flex grow={1} overflow="hidden">
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
            Reset all{" "}
            <ResetIcon className={css({ margin: "3px" })} stroke="black" />
          </Button>
        }
        className={css({
          borderLeft: "none",
          borderRight: "none",
          minWidth: "20vw",
        })}
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
            dispatch(allZonesReset());
            onClose();
          }}
        />
        <div className={css({ overflowY: "auto", overflowX: "hidden" })}>
          <Accordion allowToggle>
            <GeneralFormAccordion />
            <MainGroupList />
            <ZonesList />
          </Accordion>
        </div>
      </Panel>
      <ResizablePanel
        title="View"
        defaultHeight="100%"
        defaultWidth="50%"
        minWidth="20vw"
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: true,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        toolbarButton={
          <>
            <Flex alignItems={"center"}>
              <Button
                variant={"outline"}
                size="xs"
                onClick={() => navigate("./bytesim-webapp/1")}
              >
                1
              </Button>
              <Button
                variant={"outline"}
                size="xs"
                onClick={() => navigate("./bytesim-webapp/2")}
              >
                2
              </Button>
              <Button
                variant={"outline"}
                size="xs"
                onClick={() => navigate("./bytesim-webapp/3")}
              >
                3
              </Button>
              <Button
                variant={"outline"}
                size="xs"
                onClick={() => navigate("./bytesim-webapp/4")}
              >
                4
              </Button>
            </Flex>
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
          </>
        }
      >
        <ZonesView disableEdition={project.status === "SIMULATION"} />
      </ResizablePanel>
      <Panel
        title="Simulation"
        className={css({
          minWidth: "26vw",
          maxWidth: "26vw",
          backgroundColor: colorTheme[50],
          position: "relative",
          borderLeft: "none",
        })}
        id="report"
        toolbarButton={
          <Flex gap={1}>
            {/* <ReloadRecoButton /> */}
            <ExportButton />
          </Flex>
        }
      >
        {/* {project.status === "EDITING" ? (
          <ButtonWithIconCustom
            icon={<CalculateArrow />}
            label={"Calculate"}
            subLabel={"Validate the initial state and launch the calculation"}
            onClick={startSimulation}
          />
        ) : (
          <ButtonWithIconCustom
            icon={<TimesIcon />}
            label={"Stop"}
            subLabel={"Stop the simulation"}
            onClick={() => {
              dispatch(projectUpdated({ status: "EDITING" }));
            }}
          />
        )} */}
        {/* <Text px={4} py={2} fontSize="xs" color={"gray.700"}>
          {
            "Entering as many parameters as possible allows you to refine the calculation of your page. #happygreen"
          }
        </Text> */}
        <RecoReport />
      </Panel>
    </Flex>
  );
}
