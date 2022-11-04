import { Divider, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  allZoneSelector,
  useAppSelector,
  useCalculateAllRecommandations,
  useCalculateGenericRecommandations,
} from "../../app/hooks";
import { GenericParameters } from "../../app/types/generalFormTypes";
import { RecommandationWithZone } from "../../app/types/recommandations";
import { VideoParameters } from "../../app/types/videoTypes";
import { recommandationsPopulated } from "../../features/recommandations/recommandationsSlice";
import usePrev from "../../hooks/usePrev";
import { areArraysEqual } from "../../services/utils";
import RecommandationsList from "./RecommandationsList";
import ReportGeneralInfo from "./ReportGeneralInfo";
import ReportToolBar from "./ReportToolBar";

export default function RecoReport({ className }: { className?: string }) {
  return (
    <>
      <Divider />
      <ReportBody allOpen={false} className={className} />
    </>
  );
}
interface ReportBodyProps {
  allOpen: boolean;
  className?: string;
  customRecos?: RecommandationWithZone<
    | VideoParameters[keyof VideoParameters]
    | GenericParameters[keyof GenericParameters]
  >[];
}
export function ReportBody({
  allOpen,
  className,
  customRecos,
}: ReportBodyProps) {
  const dispatch = useDispatch();
  const recommandations = useCalculateAllRecommandations();
  const genericRecomandations = useCalculateGenericRecommandations();
  const zones = useAppSelector(allZoneSelector);
  const prevZones = usePrev(zones) ?? [];

  /* const zonesParams = useAppSelector((state) => {
    return Object.values(state.zones).filter((zone) => zone.filter());
  }); */
  const projectGeneralParams = useAppSelector((state) => state.project.params);
  useEffect(() => {
    dispatch(
      recommandationsPopulated([...genericRecomandations, ...recommandations])
    );
  }, [areArraysEqual(zones, prevZones), projectGeneralParams]);
  const recos = useAppSelector((state) => state.recommandations);
  return (
    <Flex direction={"column"} id="TO_EXPORT" className={className}>
      <ReportGeneralInfo />
      <Divider />
      <ReportToolBar />
      <Divider />
      {recos.length > 0 ? (
        <RecommandationsList
          recommandations={customRecos || recos}
          allOpen={allOpen}
        />
      ) : (
        <Flex p={3} color={"gray.400"}>
          No recommandations. Congrats!
        </Flex>
      )}
    </Flex>
  );
}
