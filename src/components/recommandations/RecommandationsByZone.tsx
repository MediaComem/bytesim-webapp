import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
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
    zoneRecommandations[0].zoneName !== "Generic" &&
    zone &&
    zone.zoneType !== undefined
      ? simulationService.simulator(zone, true, nbVisits)!.simulateOptimal()
      : {
          energy: 0,
          co2: 0,
        };

  const currentZoneImpact =
    zoneRecommandations[0].zoneName !== "Generic" &&
    zone &&
    zone.zoneType !== undefined
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
      >
        <Grid templateColumns="1fr 10fr 10fr 1fr" gap={3} w="100%">
          <AccordionChevron isExpanded={isOpenAccordion} />
          <GridItem textAlign="start">
            <Text mr={1} mb={2} fontSize="xs">
              <Text as="span" fontWeight={700}>
                {zoneRecommandations[0].zoneName === "Generic"
                  ? "General Parameters"
                  : zoneRecommandations[0].zoneName}
              </Text>
              <Text as="span" hidden={zone?.zoneType === undefined}>
                {" - " + zone?.zoneType ?? "–"}
              </Text>
            </Text>
            <Text fontSize={"xs"}></Text>
            {zone?.zoneType ? (
              <>
                <Text fontSize={"xs"}>
                  <Flex>
                    <Box mr={4}>
                      <Text>Initial parameters:</Text>
                      <Text>Most sober:</Text>
                      <Text>Potential gain:</Text>
                    </Box>
                    <Box>
                      <Text
                        textAlign={"right"}
                      >{`${currentZoneImpact.energy.toFixed(0)} Kwh`}</Text>
                      <Text
                        textAlign={"right"}
                      >{`${optimalZoneImpact.energy.toFixed(0)} Kwh`}</Text>
                      <Divider />
                      <Text textAlign={"right"}>{`${(
                        currentZoneImpact.energy - optimalZoneImpact.energy
                      ).toFixed(0)} Kwh`}</Text>
                    </Box>
                  </Flex>
                </Text>
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
