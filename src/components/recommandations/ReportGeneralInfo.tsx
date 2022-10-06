import { Flex, Text } from "@chakra-ui/react";
import { useAppSelector } from "../../app/hooks";
import { useRecommandationsTotalBenefits } from "../../features/recommandations/recommandationsSlice";

export default function ReportGeneralInfo() {
  const totalBenef = useRecommandationsTotalBenefits();
  const nbOfVisit = useAppSelector((state) => state.project.params);
  const nbOfVisitDefined = nbOfVisit?.nbVisit && nbOfVisit.nbVisit > 0;
  const totalCO2Benef = `-${(nbOfVisit?.nbVisit && nbOfVisit.nbVisit > 0) ? (totalBenef.co2 * nbOfVisit.nbVisit).toFixed(3) : totalBenef.co2.toFixed(3)} ${nbOfVisitDefined ? '' : '/visit'}`;
  const totalkWhBenef = `-${(nbOfVisit?.nbVisit && nbOfVisit.nbVisit > 0) ? (totalBenef.energy * nbOfVisit.nbVisit).toFixed(3) : totalBenef.energy.toFixed(3)} ${nbOfVisitDefined ? '' : '/visit'}`;
  return (
    <Flex justify={"stretch"} align="center" minHeight={"fit-content"}>
      <Flex direction={"column"} justify="center" p={2} grow={1}>
        <Text fontSize={"sm"} color={"gray.500"}>KwH</Text>
        <Text fontSize="lg" color={'green.600'} fontWeight={"semibold"}>{totalkWhBenef}</Text>
      </Flex>
      <Flex
        direction={"column"}
        justify="center"
        p={2}
        borderLeft={"1px solid lightgray"}
        grow={1}
      >
        <Text fontSize={"sm"} color={"gray.500"}>CO2</Text>
        <Text fontSize="lg" color={'green.600'} fontWeight={"semibold"}>{totalCO2Benef}</Text>
      </Flex>
    </Flex>
  );
}
