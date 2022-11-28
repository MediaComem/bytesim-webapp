import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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

export enum FilterType {
  POTENTIEL_GAIN = "Potentiel gain",
  NAME = "Name",
}

export function ReportBody({
  allOpen,
  className,
  customRecos,
}: ReportBodyProps) {
  const dispatch = useDispatch();
  const recommandations = useCalculateAllRecommandations();
  const genericRecomandations = useCalculateGenericRecommandations();
  const zones = useAppZones();
  const [filterBy, setFilterBy] = useState<FilterType>(
    FilterType.POTENTIEL_GAIN
  );

  const projectGeneralParams = useAppSelector((state) => state.project.params);
  const recos = useAppSelector((state) => state.recommandations);
  useEffect(() => {
    dispatch(
      recommandationsPopulated([...genericRecomandations, ...recommandations])
    );
  }, [zones, projectGeneralParams]);
  return (
    <Flex direction={"column"} id="TO_EXPORT" className={className}>
      <ReportGeneralInfo />
      <Divider />
      <Box p={2}>
        <Text fontSize="xs">
          Estimated visit/month : {projectGeneralParams.nbVisit}
        </Text>
      </Box>
      <ReportToolBar
        onChangeFilter={(newFilter: FilterType) => setFilterBy(newFilter)}
        currentFilter={filterBy}
      />
      <Divider />
      {recos?.length > 0 ? (
        <RecommandationsList
          recommandations={customRecos || recos}
          allOpen={allOpen}
          filterBy={filterBy}
        />
      ) : (
        <Flex p={3} color={"gray.400"}>
          No recommandations. Congrats!
        </Flex>
      )}
    </Flex>
  );
}
