import { Divider, Flex } from "@chakra-ui/react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector, useCalculateAllRecommandations } from "../../app/hooks";
import { recommandationsPopulated } from "../../features/recommandations/recommandationsSlice";
import RecommandationsList from "./RecommandationsList";
import ReportGeneralInfo from "./ReportGeneralInfo";
import ReportToolBar from "./ReportToolBar";

export default function RecoReport({ className }: { className?: string }) {
  return (
    <>
    <Divider/>
      <ReportBody allOpen={false} className={className} />
    </>
  );
}
interface ReportBodyProps {
  allOpen: boolean;
  className?: string;
}
export function ReportBody({ allOpen, className }: ReportBodyProps) {
  const dispatch = useDispatch();
  const recommandations = useCalculateAllRecommandations();
  const zones = useAppSelector((state) => state.zones);
  React.useEffect(() => {
    dispatch(recommandationsPopulated(recommandations));
  }, [zones])
  const recos = useAppSelector((state) => state.recommandations);
  return (
    <Flex direction={"column"} id="TO_EXPORT" className={className}>
      <ReportGeneralInfo />
      <Divider/>
      <ReportToolBar />
      <Divider />
      {recos.length > 0 ? (
        <RecommandationsList recommandations={recos} allOpen={allOpen} />
      ) : (
        <Flex p={3} color={"gray.400"}>
          No recommandations. Congrats!
        </Flex>
      )}
    </Flex>
  );
}
