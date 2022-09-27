import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import AccordionChevron from "../layout/AccordionChevron";
import AccordionCustomTitle from "../layout/AccordionCustomTitle";

export default function MainGroupList() {
  return (
    <AccordionItem isDisabled>
      <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}>
        <AccordionChevron isExpanded={false} />
        <Box flex="1" textAlign="left">
          <AccordionCustomTitle label={'Main group'} icon="importedGroup" />
        </Box>
      </AccordionButton>
      <AccordionPanel>Nothing here yet.</AccordionPanel>
    </AccordionItem>
  );
}
