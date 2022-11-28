import { Box, Button, Divider, Flex, Heading } from "@chakra-ui/react";
//import html2canvas from "html2canvas";
//import JsPDF from "jspdf";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { ReportBody } from "./RecoReport";

export default function ReportExportTemplate() {
  const navigate = useNavigate();
  const HTML_TO_EXPORT = useRef<any>(null);
  const recos = useAppSelector((state) => state.recommandations);
  const projectName = useAppSelector((state) => state.project.name);
  // export function with libs html2Canvas and jsPdf if wanted in future
  /* const generatePDF = () => {
    html2canvas(HTML_TO_EXPORT.current, {
      scale: 2, // use the desired scale
      allowTaint: true,
      useCORS: true,
    }).then((canvas) => {
      // Your IMAGE_DATA_URI
      //const imgData = canvas.toDataURL("image/jpeg");
      // Make pdf
      const report = new JsPDF("portrait", "pt", [
        canvas.width + 40,
        canvas.height + 40,
      ]);
      // add image
      report.addImage(
        canvas,
        "JPEG",
        20,
        20,
        canvas.width,
        canvas.height,
        "report2",
        "NONE",
        0
      );
      // Save report
      report.save("report.pdf");
      navigate("/bytesim-webapp");
    });
  }; */
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
              onClick={() => navigate("/bytesim-webapp")}
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
          <ReportBody allOpen={true} customRecos={recos} />
        </Flex>
      </Flex>
    </>
  );
}
