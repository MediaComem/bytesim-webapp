import { Button, Divider, Flex } from "@chakra-ui/react";
import * as React from "react";
import { useAppSelector } from "../../app/hooks";
import { Benefits } from "../../app/types/recommandations";
import RecommandationsList from "./RecommandationsList";
import ReportGeneralInfo from "./ReportGeneralInfo";
import ReportToolBar from "./ReportToolBar";

interface ReportContext {
  totalBenefits: Benefits;
  setTotalBenefits: (newBenef: Benefits) => void;
}

const defaultReportContext: ReportContext = {
  totalBenefits: { co2: 0, energy: 0 },
  setTotalBenefits: () => {},
};
export const ReportCTX = React.createContext<ReportContext>(defaultReportContext);

export default function RecoReport() {
  const recos = useAppSelector((state) => state.recommandations);
  const [totalBenefits, setTotalBenefits] = React.useState<Benefits>({
    energy: 0,
    co2: 0,
  });
  return (
    <ReportCTX.Provider
    value={{
      setTotalBenefits,
      totalBenefits
    }}>
      <Flex direction={"column"}>
        <ReportGeneralInfo totalBenefits={totalBenefits} />
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
          onClick={() => setTotalBenefits({ energy: 1, co2: 1 })}
        >
          TODO:Export report
        </Button>
      </Flex>
      </ReportCTX.Provider>
  );
}
