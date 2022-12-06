import { Box, Button, Divider, Flex, Heading } from "@chakra-ui/react";
//import html2canvas from "html2canvas";
//import JsPDF from "jspdf";
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { ReportBody } from "./RecoReport";

export default function ReportExportTemplate() {
  const navigate = useNavigate();
  const HTML_TO_EXPORT = useRef<any>(null);
  const recos = useAppSelector((state) => state.recommandations);
  const projectName = useAppSelector((state) => state.project.name);
  const { search } = useLocation();
  return (
    <>
      <Flex
        direction="column"
        p={4}
        w={"180mm"}
        alignSelf="center"
        id="reportToPrint"
        overflow={"hidden"}
      >
        <Flex
          justify={"space-between"}
          align={"flex-end"}
          pb={4}
          id="exportToolbox"
        >
          <Heading size={"md"}>Report export</Heading>
          <div>
            <Button
              onClick={() => navigate(`/figma${search}`)}
              colorScheme="brand"
              variant="outline"
              marginRight={2}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                window.print();
              }}
              colorScheme="brand"
            >
              Export in PDF
            </Button>
          </div>
        </Flex>

        <Flex
          border={"2px solid lightgrey"}
          p={4}
          ref={HTML_TO_EXPORT}
          direction="column"
          overflow={"auto"}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading
              size={"md"}
              borderBottom="1px solid lightgrey"
              lineHeight={10}
            >
              ByteSim report
            </Heading>
            <Box>{projectName}</Box>
          </Box>
          <Divider />
          <Flex direction={"column"} id="TO_EXPORT">
            <ReportBody allOpen={true} customRecos={recos} isReportPage />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
