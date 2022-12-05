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
import { colorTheme } from "../../theme";
import { Zone } from "../../app/types/types";
import simulationService from "../../services/simulationService";
import { EServerType } from "../../app/types/generalFormTypes";

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
  const nbVisits = useAppSelector((state) => state.project.params.nbVisit) ?? 1;
  const serverType =
    useAppSelector((state) => state.project.params.server) ??
    EServerType.RENEWABLE;
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

  const optimalZoneImpact =
    zoneRecommandations[0].zoneName !== "Generic" && zone
      ? simulationService.simulator(zone, true, nbVisits)!.simulateOptimal()
      : {
          energy: 0,
          co2: 0,
        };

  const currentZoneImpact =
    zoneRecommandations[0].zoneName !== "Generic" && zone
      ? simulationService
          .simulator(zone, serverType === EServerType.RENEWABLE, nbVisits)!
          .simulate()
      : {
          energy: 0,
          co2: 0,
        };

  return zoneRecommandations ? (
    <AccordionItem>
      <AccordionButton
        _hover={{ backgroundColor: "brand.100" }}
        pl={2}
        onClick={() => {
          onToggleAccordion(zoneId);
        }}
        borderBottom={`1px solid ${colorTheme[100]}`}
      >
        <Grid templateColumns="1fr 10fr 10fr 1fr" gap={3} w="100%">
          <AccordionChevron isExpanded={isOpenAccordion} />
          <GridItem textAlign="start">
            <Text mr={1} fontSize="xs" fontWeight={700}>
              {zoneRecommandations[0].zoneName === "Generic"
                ? "General Parameters"
                : zoneRecommandations[0].zoneName}
            </Text>
            <Text fontSize={"xs"}>{zone?.zoneType ?? "–"}</Text>
            {zone?.zoneType ? (
              <>
                <Text fontSize={"xs"}>{`Optimal: -${(
                  currentZoneImpact.energy - optimalZoneImpact.energy
                ).toFixed(0)} Kwh`}</Text>
                <Text
                  fontSize={"xs"}
                >{`Current: ${currentZoneImpact.energy.toFixed(0)} Kwh`}</Text>
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
    </AccordionItem>
  ) : null;
}
