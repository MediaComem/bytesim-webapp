import { Flex, Heading, Text } from "@chakra-ui/react";
import { Benefits } from "../../app/types/recommandations";

export default function ReportGeneralInfo({
  totalBenefits,
}: {
  totalBenefits: Benefits;
}) {
  return (
    <Flex justify={"stretch"} align="center" minHeight={"fit-content"}>
      <Flex direction={"column"} justify="center" p={2} grow={1}>
        <Heading size={"sm"}>KwH</Heading>
        <Text fontSize="xs">{totalBenefits.energy}/visit</Text>
      </Flex>
      <Flex
        direction={"column"}
        justify="center"
        p={2}
        borderLeft={"1px solid lightgray"}
        grow={1}
      >
        <Heading size={"sm"}>CO2</Heading>
        <Text fontSize="xs">{totalBenefits.co2}/visit</Text>
      </Flex>
    </Flex>
  );
}
