import { Flex, Spacer, Text } from "@chakra-ui/react";
import {
  useAppSelector,
  useCalculateImpact,
  useCalculateRecommandationsImpact,
} from "../../app/hooks";

export default function ReportGeneralInfo() {
  const impact = useCalculateImpact();
  const impactWithRecommandations = useCalculateRecommandationsImpact();
  const benefits = {
    energy: impact.energy - impactWithRecommandations.energy,
    co2: impact.co2 - impactWithRecommandations.co2,
  };
  const nbOfVisit =
    useAppSelector((state) => state.project.params.nbVisit) ?? 0;
  const nbOfVisitDefined = nbOfVisit && nbOfVisit > 0;
  const totalCO2Benef = `-${benefits.co2.toFixed(0)} ${
    nbOfVisitDefined ? "" : "/visit"
  }`;
  const totalkWhBenef = `-${benefits.energy.toFixed(0)} ${
    nbOfVisitDefined ? "" : "/visit"
  }`;
  return (
    <Flex justify={"stretch"} align="center" minHeight={"fit-content"}>
      <Flex direction={"column"} justify="center" p={2} grow={1}>
        <Text fontSize={"sm"} color={"gray.500"}>
          Energy (KWh)/month
        </Text>
        <Flex justify={"stretch"} align="center" minHeight={"fit-content"}>
          <Text fontSize="lg" color={"gray.600"} fontWeight={"semibold"}>
            {impact.energy.toFixed(0)}
          </Text>
          <Spacer />
          <Text fontSize="lg" color={"green.600"} fontWeight={"semibold"}>
            {totalkWhBenef}
          </Text>
        </Flex>
      </Flex>
      <Flex
        direction={"column"}
        justify="center"
        p={2}
        borderLeft={"1px solid lightgray"}
        grow={1}
      >
        <Text fontSize={"sm"} color={"gray.500"}>
          GWP ( kg CO2eq)/month
        </Text>
        <Flex justify={"stretch"} align="center" minHeight={"fit-content"}>
          <Text fontSize="lg" color={"gray.600"} fontWeight={"semibold"}>
            {impact.co2.toFixed(0)}
          </Text>
          <Spacer />
          <Text fontSize="lg" color={"green.600"} fontWeight={"semibold"}>
            {totalCO2Benef}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
