import { Accordion, Button, Flex, useDisclosure } from "@chakra-ui/react";
import { css } from "@emotion/css";
import * as React from "react";
import { useDispatch } from "react-redux";
import { colorTheme } from ".";
import { useAppSelector } from "./app/hooks";
import ConfirmModal, { confirmText } from "./components/layout/ConfirmModal";
import Panel from "./components/layout/Panel";
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
import "react-reflex/styles.css";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";

export default function Home() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const state = useAppSelector((s) => s);
  const project = state.project;
  const navigate = useNavigate();
  return (
    <ReflexContainer
      orientation="vertical"
      className={css({ overflow: "auto" })}
    >
      <ReflexElement
        className={"left-pane " + css({ display: "flex" })}
        resizeHeight={false}
        minSize={200}
      >
        <Panel
          title="Parameters"
          grow={1}
          toolbarButton={
            <Button
              onClick={onOpen}
              size="sm"
              variant="ghost"
              disabled={project.status === "SIMULATION"}
              minWidth="min-content"
            >
              Reset all{" "}
              <ResetIcon className={css({ margin: "3px" })} stroke="black" />
            </Button>
          }
          className={
            "pane-content " +
            css({
              overflow: "hidden",
            })
          }
        >
          <ConfirmModal
            texts={confirmText.resetProject}
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
      </ReflexElement>
      <ReflexSplitter className={css({ zIndex: 1 })} />
      <ReflexElement
        className={"middle-pane " + css({ display: "flex" })}
        resizeHeight={false}
        minSize={200}
      >
        <Panel
          title="View"
          className={
            "pane-content " +
            css({
              position: "relative",
            })
          }
          grow={1}
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
                minWidth="min-content"
              >
                + Create Zone
              </Button>
            </>
          }
        >
          <ZonesView disableEdition={project.status === "SIMULATION"} />
        </Panel>
      </ReflexElement>
      <ReflexSplitter />
      <ReflexElement
        className={"right-pane " + css({ display: "flex" })}
        resizeHeight={false}
        minSize={200}
      >
        <Panel
          title="Simulation"
          className={
            "pane-content " +
            css({ backgroundColor: colorTheme[50], borderLeft: "none" })
          }
          grow={1}
          id="report"
          toolbarButton={
            <Flex gap={1}>
              {/* <ReloadRecoButton /> */}
              <ExportButton />
            </Flex>
          }
        >
          <RecoReport />
        </Panel>
      </ReflexElement>
    </ReflexContainer>
  );
}
