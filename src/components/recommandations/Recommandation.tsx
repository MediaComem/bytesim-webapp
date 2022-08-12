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
import { Benefits, RecommandationWithZone } from "../../app/types/recommandations";
import { VideoParameters } from "../../app/types/videoTypes";

interface RecommandationDisplayProps {
  recommandation: RecommandationWithZone<
    VideoParameters[keyof VideoParameters]
  >;
  updateTotalBenefits: (benef: Benefits, substract?: boolean)=>void;
}

export default function RecommandationDisplay({
  recommandation,
}: RecommandationDisplayProps) {
  const [selected, setSelected] = React.useState<string>('current');

 /*  const onChangeParams = React.useCallback(
    (v: string) => {
        if (v !== selected) {
          if (v === "better") {
            updateTotalBenefits(recommandation.benefits);
            //enlever recommandation.benefits du state parent
          } else if (v === "current") {
            updateTotalBenefits(recommandation.benefits, true);
            //enlever recommandation.benefits du state parent
          }
        }
        console.log(selected);
      console.log(v);
        setSelected(v);
      }, [selected]
  ); */
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
        <RadioGroup
          value={selected}
        >
          <Stack>
            <Radio colorScheme={"brand"} value={"current"} size="sm" onChange={(e) => setSelected(e.target.value)}>
              Current:{recommandation.currentValue}
            </Radio>
            <Radio colorScheme={"brand"} value={"better"} size="sm" onChange={(e) => setSelected(e.target.value)}>
              Better:{recommandation.betterValue}
            </Radio>
            {/* <Radio
              colorScheme={"brand"}
              value={3}
              onChange={() => {}}
              size="sm"
            >
              Optimal:{recommandation.bestValue}
            </Radio> */}
          </Stack>
        </RadioGroup>
      </AccordionPanel>
    </AccordionItem>
  );
}
