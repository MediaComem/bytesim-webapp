import { Divider, Flex } from "@chakra-ui/react";
import { css } from "@emotion/css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  useAppSelector,
  useAppZones,
  useCalculateAllRecommandations,
  useCalculateGenericRecommandations,
} from "../../app/hooks";
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
      <Divider />
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
export function ReportBody({
  allOpen,
  customRecos,
  isReportPage,
}: ReportBodyProps) {
  const dispatch = useDispatch();
  const recommandations = useCalculateAllRecommandations();
  const genericRecomandations = useCalculateGenericRecommandations();
  const zones = useAppZones();

  /* const zonesParams = useAppSelector((state) => {
    return Object.values(state.zones).filter((zone) => zone.filter());
  }); */
  const projectGeneralParams = useAppSelector((state) => state.project.params);
  const recos = useAppSelector((state) => state.recommandations);
  const uncompleteZones = useAppSelector(getUncompleteZones);
  useEffect(() => {
    dispatch(
      recommandationsPopulated([...genericRecomandations, ...recommandations])
    );
  }, [zones, projectGeneralParams]);

  return (
    <>
      <Flex direction="column">
        {!isReportPage && uncompleteZones.length !== 0 && (
          <RecoWarning uncompleteZoneNames={uncompleteZones} />
        )}
        <ReportGeneralInfo />
        <Divider />
        <ReportToolBar />
        <Divider />
      </Flex>
      <div className={css({ overflowY: "auto", overflowX: "hidden" })}>
        {recos?.length > 0 ? (
          <RecommandationsList
            recommandations={customRecos || recos}
            allOpen={!!allOpen}
          />
        ) : (
          <Flex p={3} color={"gray.400"}>
            No recommandations. Congrats!
          </Flex>
        )}
      </div>
    </>
  );
}
