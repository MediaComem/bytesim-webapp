import { Divider, Flex } from "@chakra-ui/react";
import * as React from "react";
import { useAppSelector } from "../../app/hooks";
import ExportButton from "./ExportButton";
import RecommandationsList from "./RecommandationsList";
import ReportGeneralInfo from "./ReportGeneralInfo";
import ReportToolBar from "./ReportToolBar";

export default function RecoReport({ className }: { className?: string }) {
  return (
    <>
    <Divider/>
      <ReportBody allOpen={false} className={className} />
      <ExportButton />
    </>
  );
}
interface ReportBodyProps {
  allOpen: boolean;
  className?: string;
}
export function ReportBody({ allOpen, className }: ReportBodyProps) {
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
