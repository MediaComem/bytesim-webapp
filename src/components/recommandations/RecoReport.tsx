import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Text,
} from "@chakra-ui/react";
import { css } from "@emotion/css";
import { isEqual } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useAppSelector,
  useCalculateAllRecommandations,
  useCalculateGenericRecommandations,
} from "../../app/hooks";
import { RootState } from "../../app/store";
import { GenericParameters } from "../../app/types/generalFormTypes";
import { RecommandationWithZone } from "../../app/types/recommandations";
import { VideoParameters } from "../../app/types/videoTypes";
import { recommandationsPopulated } from "../../features/recommandations/recommandationsSlice";
import { getUncompleteZones } from "../../features/zones/zonesSlice";
import RecommandationsList from "./RecommandationsList";
import RecoWarning from "./RecoWarning";
import ReportGeneralInfo from "./ReportGeneralInfo";
import ReportToolBar from "./ReportToolBar";

export default function RecoReport() {
  return (
    <>
      <ReportBody />
    </>
  );
}
interface ReportBodyProps {
  allOpen?: boolean;
  customRecos?: RecommandationWithZone<
    | VideoParameters[keyof VideoParameters]
    | GenericParameters[keyof GenericParameters]
  >[];
  isReportPage?: boolean;
}

export enum FilterType {
  POTENTIEL_GAIN = "Potentiel gain",
  NAME = "Name",
}

export function ReportBody({
  allOpen,
  customRecos,
  isReportPage,
}: ReportBodyProps) {
  const dispatch = useDispatch();
  const recommandations = useCalculateAllRecommandations();
  const genericRecomandations = useCalculateGenericRecommandations();
  const zonesHiddenId: string[] = [];
  const zones = useAppSelector(
    (state: RootState) =>
      state.zonesSlice.zones
        .filter((z) => {
          const inTheHiddenList = zonesHiddenId.includes(z.id);
          // if hidden and not in the list of hidden zones, put it in the list
          if (z.hidden && !inTheHiddenList) {
            zonesHiddenId.push(z.id);
          }
          // if it's not hidden and in the list remove it
          if (!z.hidden && inTheHiddenList) {
            zonesHiddenId.splice(zonesHiddenId.indexOf(z.id), 1);
          }

          return !z.hidden;
        })
        // compare without status field
        .map((z) => ({ ...z, status: undefined })),
    isEqual
  );
  const [filterBy, setFilterBy] = useState<FilterType>(
    FilterType.POTENTIEL_GAIN
  );

  const projectGeneralParams = useAppSelector((state) => state.project.params);
  const recos = useAppSelector((state) => state.recommandations);
  // const recos: any = [];
  const uncompleteZones = useAppSelector(getUncompleteZones, isEqual);
  const [errorPanelToggled, setErrorPanelToggled] = React.useState(false);
  const toggleErrorPannel = useCallback((): void => {
    setErrorPanelToggled((prev) => !prev);
  }, [setErrorPanelToggled]);
  useEffect(() => {
    dispatch(
      recommandationsPopulated([...genericRecomandations, ...recommandations])
    );
  }, [zones, projectGeneralParams]);

  const recommandationsList = (customRecos || recos).filter((r) => {
    return !zonesHiddenId.includes(r.zoneId);
  });

  return (
    <>
      <Accordion
        index={errorPanelToggled ? 0 : 1}
        flex={1}
        overflow="hidden"
        display={"flex"}
        flexDirection="column"
      >
        <RecoWarning
          isHidden={!(!isReportPage && uncompleteZones.length !== 0)}
          isToggled={errorPanelToggled}
          uncompleteZoneNames={uncompleteZones}
          toggleErrorPannel={toggleErrorPannel}
        />
        <AccordionItem
          overflow={"hidden"}
          display={"flex"}
          flexDirection="column"
          className={css({
            ".chakra-collapse": {
              display: "flex !important",
              flexDirection: "column",
            },
          })}
        >
          <AccordionButton hidden={true} />
          <AccordionPanel
            p={0}
            overflow="hidden"
            display={"flex"}
            flexDirection="column"
          >
            <Box>
              <ReportGeneralInfo />
            </Box>
            <Box p={2}>
              <Text fontSize="xs">
                Estimated visit/month : {projectGeneralParams.nbVisit}
              </Text>
            </Box>
            <ReportToolBar
              onChangeFilter={setFilterBy}
              currentFilter={filterBy}
            />
            <Divider />
            <div className={css({ overflowY: "auto", overflowX: "hidden" })}>
              {recommandationsList?.length > 0 ? (
                <RecommandationsList
                  recommandations={recommandationsList}
                  allOpen={!!allOpen}
                  filterBy={filterBy}
                />
              ) : (
                <Flex p={3} color={"gray.400"}>
                  No recommandations. Congrats!
                </Flex>
              )}
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
