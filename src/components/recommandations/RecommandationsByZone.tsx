import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Grid,
  GridItem,
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
  isOpenAccordion: boolean;
  onToggleAccordion: (id: string) => void;
}

export default function RecommandationsByZone({
  zoneRecommandations,
  zoneId,
  onToggleAccordion,
  isOpenAccordion,
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
      <AccordionButton
        _hover={{ backgroundColor: "brand.100" }}
        pl={2}
        onClick={() => {
          onToggleAccordion(zoneId);
        }}
      >
        <Grid templateColumns="1fr 10fr 10fr 1fr" gap={3} w="100%">
          <AccordionChevron isExpanded={isOpenAccordion} />
          <GridItem textAlign="start">
            <Text mr={1} fontSize="xs" fontWeight={700}>
              {zoneRecommandations[0].zoneName}
            </Text>
            <Text fontSize={"xs"}>{zone?.zoneType ?? "–"}</Text>
            {zone?.zoneType ? (
              <>
                <Text fontSize={"xs"}>{`Optimal: -${optimal.toFixed(
                  0
                )} Kwh`}</Text>
                <Text fontSize={"xs"}>{`Current: – Kwh`}</Text>
              </>
            ) : null}
          </GridItem>
          <GridItem>
            <ZoneScreenshot zoneId={zoneId} />
          </GridItem>
        </Grid>
      </AccordionButton>
      <AccordionPanel>
        {zoneRecommandations?.map((reco) => defineRecommandationType(reco))}
      </AccordionPanel>
    </AccordionItem>
  ) : null;
}
