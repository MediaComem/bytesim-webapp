import { Button, Divider, Flex } from "@chakra-ui/react";
import RecommandationsList from "./RecommandationsList";
import ReportGeneralInfo from "./ReportGeneralInfo";
import ReportToolBar from "./ReportToolBar";

export default function RecoReport() {
  return (
    <>
      <Flex direction={'column'}>
        <ReportGeneralInfo />
        <Divider />
        <ReportToolBar />
        <Divider />
        <RecommandationsList />
        <Button variant={'outline'} colorScheme='brand'>EXPORT REPORT</Button>
      </Flex>
    </>
  );
}
