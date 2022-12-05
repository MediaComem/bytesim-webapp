import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import {
  useAppSelector,
  useCalculateImpact,
  useCalculateOptimalImpact,
  useCalculateRecommandationsImpact,
} from "../../app/hooks";

type ReportItemProps = {
  label: string;
  value: string;
  comparedValue?: string;
};

const ReportItem = ({ label, value, comparedValue }: ReportItemProps) => (
  <Box>
    <Text fontSize="xs">{label}</Text>
    <Box pt={2}>
      <Text fontSize="md">{value}</Text>
      {comparedValue ? (
        <Text fontSize="xs">{`(-${comparedValue})`}</Text>
      ) : null}
    </Box>
  </Box>
);

export default function ReportGeneralInfo() {
  const impact = useCalculateImpact();
  const impactWithRecommandations = useCalculateRecommandationsImpact();
  const optimalImpact = useCalculateOptimalImpact();
  const benefits = {
    energy: impact.energy - impactWithRecommandations.energy,
    co2: impact.co2 - impactWithRecommandations.co2,
  };
  const nbOfVisit =
    useAppSelector((state) => state.project.params.nbVisit) ?? 0;
  const nbOfVisitDefined = nbOfVisit && nbOfVisit > 0;
  const totalCO2Benef = `${benefits.co2.toFixed(0)}${
    nbOfVisitDefined ? "" : "/visit"
  }`;
  const totalkWhBenef = `${benefits.energy.toFixed(0)}${
    nbOfVisitDefined ? "" : "/visit"
  }`;
  return (
    <Grid
      templateColumns="1fr 1fr"
      gap={4}
      bg="rgba(0,0,0,0.7)"
      p={4}
      color="white"
    >
      <GridItem colSpan={2} mb={-4}>
        <Text fontSize="xs" fontWeight={600}>
          Total consumption/month
        </Text>
      </GridItem>
      <ReportItem label="Energy (KWh)" value={impact.energy.toFixed(0)} />
      <ReportItem label="GWP (kg CO2eq)" value={impact.co2.toFixed(0)} />
      <GridItem colSpan={2} mb={-4}>
        <Text fontSize="xs" fontWeight={600}>
          With recommandations
        </Text>
      </GridItem>
      <ReportItem
        label="Energy (KWh)"
        value={impactWithRecommandations.energy.toFixed(0)}
        comparedValue={totalkWhBenef}
      />
      <ReportItem
        label="GWP (kg CO2eq)"
        value={impactWithRecommandations.co2.toFixed(0)}
        comparedValue={totalCO2Benef}
      />
      <GridItem colSpan={2} mb={-4}>
        <Text fontSize="xs" fontWeight={600}>
          Optimal
        </Text>
      </GridItem>
      <ReportItem
        label="Energy (KWh)"
        value={optimalImpact.energy.toFixed(0)}
      />
      <ReportItem label="GWP (kg CO2eq)" value={optimalImpact.co2.toFixed(0)} />
    </Grid>
  );
}
