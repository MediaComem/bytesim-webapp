import {
  Accordion,
  Button,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { css } from "@emotion/css";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./app/hooks";
import CustomModal, { confirmText } from "./components/layout/CustomModal";
import Panel from "./components/layout/Panel";
import RecoReport from "./components/recommandations/RecoReport";
import MainGroupList from "./components/zones/MainGroupList";
import GeneralFormAccordion from "./components/project/GeneralForm";
import ZonesList from "./components/zones/ZonesList";
import ZonesView from "./components/zones/ZonesView";
import { projectReset } from "./features/project/projectSlice";

import { ReactComponent as ResetIcon } from "./assets/ResetIcon.svg";
import ExportButton from "./components/recommandations/ExportButton";
//import { useNavigate } from "react-router-dom";
import { colorTheme } from "./theme";
import { allZonesReset, zoneAdded } from "./features/zones/zonesSlice";
import "react-reflex/styles.css";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import RecoSpinner from "./components/recommandations/RecoSpinner";
import {
  REMOTE_PARENT_ID,
  ZONES_CONTAINER_PADDING,
} from "./features/importImage/utils";
import { useState } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const project = useAppSelector((s) => s.project);
  const [zoom, setZoom] = useState<number>(100);
  const [isFitWidth, setFitWidth] = useState(true);

  const fitSizeZoom = (
    { dim }: { dim: "height" | "width" } = { dim: "width" }
  ) => {
    // fit the zoom to make the svg fit the width/height of the container
    // zoom is between 100 and 1000
    const svg = document.getElementById(REMOTE_PARENT_ID);
    const container = document.getElementById("zones-container");
    if (svg && container) {
      const svgDim = svg.getBoundingClientRect()[dim];
      const containerDim =
        container.getBoundingClientRect()[dim] -
        2 * ZONES_CONTAINER_PADDING * 4;
      const newZoom = Math.min(
        Math.max(100, (containerDim * 100) / svgDim),
        1000
      );
      setZoom(newZoom);
      setFitWidth(dim === "width");
      return newZoom;
    }
    return 100;
  };

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
          <CustomModal
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
      <ReflexSplitter
        style={{ border: "2px" }}
        className={css({ zIndex: 1 })}
      />
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
                <Flex align="center" gap={2} mx={1}>
                  <Button
                    disabled={isFitWidth}
                    size={"sm"}
                    variant="outline"
                    onClick={() => {
                      fitSizeZoom({ dim: "width" });
                    }}
                    alignItems="center"
                  >
                    Fit width
                  </Button>
                  {/* <Slider
                    aria-label="slider-zoom"
                    defaultValue={1}
                    colorScheme={"brand"}
                    min={100}
                    max={1000}
                    onChange={setZoom}
                    width="100px"
                    step={1}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip
                      hasArrow
                      bg="teal.500"
                      color="white"
                      placement="top"
                      isOpen={showTooltip}
                      label={`${zoom}%`}
                    >
                      <SliderThumb
                        className={css({ boxShadow: "none" })}
                        width="10px"
                        height="10px"
                      />
                    </Tooltip>
                  </Slider> */}
                  <Button
                    disabled={!isFitWidth}
                    size={"sm"}
                    variant="outline"
                    onClick={() => {
                      fitSizeZoom({ dim: "height" });
                    }}
                  >
                    Fit height
                  </Button>
                </Flex>
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
          <ZonesView
            disableEdition={project.status === "SIMULATION"}
            zoom={zoom / 100}
          />
        </Panel>
      </ReflexElement>
      <ReflexSplitter style={{ border: "2px" }} />
      <ReflexElement
        className={"right-pane " + css({ display: "flex" })}
        resizeHeight={false}
        minSize={200}
      >
        <Panel
          title="Simulation"
          className={
            "pane-content " +
            css({
              backgroundColor: colorTheme[50],
              borderLeft: "none",
              overflow: "hidden",
            })
          }
          grow={1}
          id="report"
          spinner={<RecoSpinner />}
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
