import { Button, Divider, Flex } from "@chakra-ui/react";
import * as React from "react";
import { useAppSelector } from "../../app/hooks";
import RecommandationsList from "./RecommandationsList";
import ReportGeneralInfo from "./ReportGeneralInfo";
import ReportToolBar from "./ReportToolBar";

export default function RecoReport() {
  const recos = useAppSelector((state) => state.recommandations);
  return (
      <Flex direction={"column"}>
        <ReportGeneralInfo />
        <Divider />
        <ReportToolBar />
        <Divider />
        {recos.length > 0 ? (
          <RecommandationsList
            recommandations={recos}
          />
        ) : (
          <Flex p={3} color={"gray.400"}>
            No recommandations. Congrats!
          </Flex>
        )}
        <Button
          variant={"outline"}
          colorScheme="brand"
        >
          TODO:Export report
        </Button>
      </Flex>
  );
}
