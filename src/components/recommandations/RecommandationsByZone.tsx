import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
} from "@chakra-ui/react";
import AccordionChevron from "../layout/AccordionChevron";
import {
  BetterChoicesRecommandation,
  BadPracticeRecommandation,
} from "./Recommandation";
import { RecommandationType } from "./RecommandationsList";
import ZoneScreenshot from "../zones/ZoneScreenshot";

interface RecommandationDisplayProps {
  zoneRecommandations: RecommandationType[];
  zoneId: string;
}

export default function RecommandationsByZone({
  zoneRecommandations,
  zoneId,
}: RecommandationDisplayProps) {
  //const { totalBenefits, setTotalBenefits } = React.useContext(ReportCTX);

  const showZone = zoneRecommandations.find((reco) => reco.betterValue);
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
      default:
        return null;
    }
  };

  return showZone ? (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}>
            <Box flex="1" textAlign="left">
              <Heading mr={1} size="sm">
                {zoneRecommandations[0].zoneName}
              </Heading>
              <ZoneScreenshot zoneId={zoneId} />
            </Box>
            <AccordionChevron isExpanded={isExpanded} />
          </AccordionButton>
          <AccordionPanel>
            {zoneRecommandations?.map((reco) => defineRecommandationType(reco))}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  ) : null;
}
