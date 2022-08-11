import { Button, Divider, Flex } from "@chakra-ui/react";
import { calculateRecommandationsForZone } from "../../app/hooks";
import { StockGeneralFormat } from "../../app/types/generalFormTypes";
import { Zone } from "../../app/types/types";
import RecommandationsList from "./RecommandationsList";
import ReportGeneralInfo from "./ReportGeneralInfo";
import ReportToolBar from "./ReportToolBar";
interface RecoReportProps {
  zones: Zone[];
  projectParams?: StockGeneralFormat;
}
export default function RecoReport({ zones }: RecoReportProps) {
  const recos = calculateRecommandationsForZone(zones[0].id);

  return (
    <>
      <Flex direction={"column"}>
        <ReportGeneralInfo />
        <Divider />
        <ReportToolBar />
        <Divider />
        {recos.length > 0 ? (
          <RecommandationsList recommandations={recos} />
        ) : (
          <Flex p={3} color={"gray.400"}>No recommandations. Congrats!</Flex>
        )}

        <Button variant={"outline"} colorScheme="brand">
          EXPORT REPORT
        </Button>
      </Flex>
    </>
  );
}
