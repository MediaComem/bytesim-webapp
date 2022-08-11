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

export default function Recommandation() {
  return (
    <AccordionItem>
      <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}>
        <Box flex="1" textAlign="left">
          <Heading mr={1} size="sm">
            Titre zone
          </Heading>
          <Flex>
          <Text>[Nom param]</Text>
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
                Current:
              </Radio>
              <Radio
                colorScheme={"brand"}
                value={2}
                onChange={() => {}}
                size="sm"
              >
                Better:
              </Radio>
              <Radio
                colorScheme={"brand"}
                value={3}
                onChange={() => {}}
                size="sm"
              >
                Optimal:
              </Radio>
            </Stack>
          </RadioGroup>
      </AccordionPanel>
    </AccordionItem>
  );
}
