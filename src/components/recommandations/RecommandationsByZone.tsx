import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";
import AccordionChevron from "../layout/AccordionChevron";
import {
  BetterChoicesRecommandation,
  BadPracticeRecommandation,
  TipRecommandation,
} from "./Recommandation";
import { RecommandationType } from "./RecommandationsList";
import ZoneScreenshot from "../zones/ZoneScreenshot";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";

interface RecommandationDisplayProps {
  zoneRecommandations: RecommandationType[];
  zoneId: string;
}

export default function RecommandationsByZone({
  zoneRecommandations,
  zoneId,
}: RecommandationDisplayProps) {
  const zone = useAppSelector((state: RootState) =>
    state.zonesSlice.zones?.find((z) => z.id === zoneId)
  );
  //const { totalBenefits, setTotalBenefits } = React.useContext(ReportCTX);
  const defineRecommandationType = (reco: RecommandationType) => {
    switch (reco.type) {
      case "betterValue":
        return (
          <BetterChoicesRecommandation recommandation={reco} key={reco.id} />
        );
      case "warning":
        return (
          <BadPracticeRecommandation recommandation={reco} key={reco.id} />
        );
      case "tip":
        return <TipRecommandation recommandation={reco} key={reco.id} />;
      default:
        return null;
    }
  };

  //TODO: not realistic computation
  const optimal = zoneRecommandations.reduce(
    (acc, curr) => acc + (curr?.benefitsBest?.energy ?? 0),
    0
  );

  return zoneRecommandations ? (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}>
            <Grid templateColumns="1fr 10fr 10fr 1fr" gap={3} w="100%">
              <AccordionChevron isExpanded={isExpanded} />
              <GridItem textAlign="start">
                <Heading mr={1} size="sm">
                  {zoneRecommandations[0].zoneName}
                </Heading>
                <Text fontSize={"sm"}>{zone?.zoneType ?? "–"}</Text>
                {zone?.zoneType ? (
                  <>
                    <Text fontSize={"sm"}>{`Optimal: -${optimal.toFixed(
                      0
                    )} Kwh`}</Text>
                    <Text fontSize={"sm"}>{`Current: -XXX Kwh`}</Text>
                  </>
                ) : null}
              </GridItem>
              <GridItem>
                <ZoneScreenshot zoneId={zoneId} />
              </GridItem>

              <GridItem>ⓘ</GridItem>
            </Grid>
          </AccordionButton>
          <AccordionPanel>
            {zoneRecommandations?.map((reco) => defineRecommandationType(reco))}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  ) : null;
}
