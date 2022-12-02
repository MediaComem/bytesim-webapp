import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import { ReactComponent as WarningIcon } from "../../assets/Warning.svg";
import AccordionChevron from "../layout/AccordionChevron";

interface RecoWarningProps {
  uncompleteZoneNames: Array<string>;
}
export default function RecoWarning({ uncompleteZoneNames }: RecoWarningProps) {
  /* const zonesParams = useAppSelector((state) => {
    return Object.values(state.zones).filter((zone) => zone.filter());
  }); */
  return (
    <Accordion allowToggle>
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton _hover={{ backgroundColor: "brand.100" }}>
              <Grid
                templateColumns="1fr 10fr 1fr"
                gap={3}
                w="100%"
                alignItems="center"
              >
                <AccordionChevron isExpanded={isExpanded} color="#C53030" />
                <GridItem textAlign="start">
                  <Text fontSize="xs" ml={2} color="red.600">
                    You have uncompleted zones that are not taken into account
                    in the calculation.
                  </Text>
                </GridItem>

                <WarningIcon />
              </Grid>
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text fontSize="xs" ml={2} color="red.600">
                <Text as="b">
                  {uncompleteZoneNames.map((name, index) =>
                    index ? `, ${name}` : name
                  )}
                </Text>
              </Text>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
}
