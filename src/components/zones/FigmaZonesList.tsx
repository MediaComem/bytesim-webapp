import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";

export default function FigmaZonesList() {
  return (
      <AccordionItem isDisabled>
        <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}>
          <AccordionIcon />
          <Box flex="1" textAlign="left">
            Main Group
          </Box>
        </AccordionButton>
        <AccordionPanel>Nothing here yet.</AccordionPanel>
      </AccordionItem>
  );
}
