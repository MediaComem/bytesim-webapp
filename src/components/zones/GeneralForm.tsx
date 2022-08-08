import {
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import AccordionItemTitleWithButton from "../layout/AccordionItemTitleWithButton";

export default function GeneralFormAccordion() {
  return (
    <AccordionItem>
      <AccordionItemTitleWithButton label='General' p={2}>
        <Button variant={'ghost'} size='sm'>Reset ⟳</Button>
      </AccordionItemTitleWithButton>
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
