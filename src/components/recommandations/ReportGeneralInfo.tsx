import { Flex, Heading, Text } from "@chakra-ui/react";
import { useRecommandationsTotalBenefits } from "../../features/recommandations/recommandationsSlice";

export default function ReportGeneralInfo() {
  const totalBenef = useRecommandationsTotalBenefits();
  return (
    <Flex justify={"stretch"} align="center" minHeight={"fit-content"}>
      <Flex direction={"column"} justify="center" p={2} grow={1}>
        <Heading size={"sm"}>KwH</Heading>
        <Text fontSize="sm" color={'green.500'} fontWeight={"semibold"}>-{totalBenef.energy.toFixed(3)}/visit</Text>
      </Flex>
      <Flex
        direction={"column"}
        justify="center"
        p={2}
        borderLeft={"1px solid lightgray"}
        grow={1}
      >
        <Heading size={"sm"}>CO2</Heading>
        <Text fontSize="sm" color={'green.500'} fontWeight={"semibold"}>-{totalBenef.co2.toFixed(3)}/visit</Text>
      </Flex>
    </Flex>
  );
}
