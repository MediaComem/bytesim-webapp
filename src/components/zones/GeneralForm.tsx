import {
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
    <AccordionItem>
      <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}>
        <AccordionIcon />
        <Box flex="1" textAlign="left">
          General
        </Box>
      </AccordionButton>
      <AccordionPanel>
        <GeneralForm />
      </AccordionPanel>
    </AccordionItem>
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
