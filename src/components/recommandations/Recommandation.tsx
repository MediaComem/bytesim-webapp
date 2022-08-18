import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { RecommandationWithZone } from "../../app/types/recommandations";
import { VideoParameters } from "../../app/types/videoTypes";
import { ReportCTX } from "./RecoReport";

interface RecommandationDisplayProps {
  recommandation: RecommandationWithZone<
    VideoParameters[keyof VideoParameters]
  >;
}

export default function RecommandationDisplay({
  recommandation,
}: RecommandationDisplayProps) {
  const [selected, setSelected] = React.useState<string>("current");
  const { totalBenefits, setTotalBenefits } = React.useContext(ReportCTX);

   const onChangeParams = React.useCallback(
    (v: string) => {
      setSelected(v);
      console.log(v);
      //console.log(selected);
      if (v === "better") {
        const newCo2 = totalBenefits.co2 + recommandation.benefits.co2;
        const newEnergy = totalBenefits.energy + recommandation.benefits.energy;
        setTotalBenefits({
          co2: newCo2,
          energy: newEnergy,
        });
      } else if (v === "current") {
        const newCo2 = totalBenefits.co2 - recommandation.benefits.co2;
        const newEnergy = totalBenefits.energy - recommandation.benefits.energy;
        setTotalBenefits({
          co2: newCo2,
          energy: newEnergy,
        });
      }
      //console.log(v);
    },
    [totalBenefits]
  );

  /*  function onAddBenefits() {
    const newCo2 = (totalBenefits.co2 + recommandation.benefits.co2);
    const newEnergy = (totalBenefits.energy + recommandation.benefits.energy);
    setTotalBenefits({
      co2: newCo2,
      energy: newEnergy
    })
  } */
  /* function onSubstractBenefits(e) {
    const newCo2 = (totalBenefits.co2 - recommandation.benefits.co2);
    const newEnergy = (totalBenefits.energy - recommandation.benefits.energy);
    setTotalBenefits({
      co2: newCo2,
      energy: newEnergy
    })
  }  */
  return (
    <AccordionItem>
      <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}>
        <Box flex="1" textAlign="left">
          <Heading mr={1} size="sm">
            {recommandation.zoneName}
          </Heading>
          <Flex>
            <Text>{recommandation.parameter}</Text>
            <Tooltip label="Biblio de reco + best practices" hasArrow>
              ⓘ
            </Tooltip>
          </Flex>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <RadioGroup value={selected} onChange={onChangeParams}>
          <Stack>
            <Radio
              colorScheme={"brand"}
              value={"current"}
              size="sm"
            >
              Current:{recommandation.currentValue}
            </Radio>
            <Radio
              colorScheme={"brand"}
              value={"better"}
              size="sm"

            >
              Better:{recommandation.betterValue}
            </Radio>
          </Stack>
        </RadioGroup>
      </AccordionPanel>
    </AccordionItem>
  );
}
