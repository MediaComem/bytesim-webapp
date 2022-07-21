import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";

export default function GeneralFormAccordion() {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            General
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <GeneralForm />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function GeneralForm() {
  return (
    <Flex>
      <Text fontSize="sm" color={"gray.700"}>
        {"Paramètres généraux sur la page"}
      </Text>
      {/* Genral form inputs here */}
    </Flex>
  );
}
