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
import { Recommandation } from "../../app/types/recommandations";
import { ZoneParamsType } from "../../app/types/types";

interface RecommandationDisplayProps {
  recommandation: Recommandation<ZoneParamsType[keyof ZoneParamsType]>;
}

export default function RecommandationDisplay({
  recommandation,
}: RecommandationDisplayProps) {
  return (
    <AccordionItem>
      <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}>
        <Box flex="1" textAlign="left">
          <Heading mr={1} size="sm">
            Titre zone
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
        <RadioGroup value={1}>
          <Stack>
            <Radio
              colorScheme={"brand"}
              value={1}
              onChange={() => {}}
              size="sm"
            >
              Current:{recommandation.currentValue}
            </Radio>
            <Radio
              colorScheme={"brand"}
              value={2}
              onChange={() => {}}
              size="sm"
            >
              Better:{recommandation.betterValue}
            </Radio>
            <Radio
              colorScheme={"brand"}
              value={3}
              onChange={() => {}}
              size="sm"
            >
              Optimal:{recommandation.bestValue}
            </Radio>
          </Stack>
        </RadioGroup>
      </AccordionPanel>
    </AccordionItem>
  );
}
