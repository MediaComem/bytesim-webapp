import {
  AccordionButton,
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
import { useDispatch } from "react-redux";
import { GenericParameters } from "../../app/types/generalFormTypes";
import {
  RecommandationOption,
  RecommandationWithZone,
} from "../../app/types/recommandations";
import { VideoParameters } from "../../app/types/videoTypes";
import { recommandationUpdated } from "../../features/recommandations/recommandationsSlice";
import useZoneScreenshot from "../../hooks/useZoneScreenshot";
import AccordionChevron from "../layout/AccordionChevron";
//import { ReportCTX } from "./RecoReport";

interface RecommandationDisplayProps {
  recommandation: RecommandationWithZone<
    | VideoParameters[keyof VideoParameters]
    | GenericParameters[keyof GenericParameters]
  >;
}

export default function RecommandationDisplay({
  recommandation,
}: RecommandationDisplayProps) {
  //const { totalBenefits, setTotalBenefits } = React.useContext(ReportCTX);
  const dispatch = useDispatch();
  const { ZoneScreenshot } = useZoneScreenshot();

  const onChangeParams = React.useCallback(
    (v: RecommandationOption) => {
      dispatch(
        recommandationUpdated({ id: recommandation.id, selectedValue: v })
      );
    },
    [recommandation]
  );
  return recommandation.betterValue ? (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}>
            <Box flex="1" textAlign="left">
              <Heading mr={1} size="sm">
                {recommandation.zoneName}
              </Heading>
              <ZoneScreenshot zoneId={recommandation.zoneId} />
              <Flex>
                <Text>{recommandation.parameter}</Text>
                <Tooltip label="Biblio de reco + best practices" hasArrow>
                  ⓘ
                </Tooltip>
              </Flex>
            </Box>
            <AccordionChevron isExpanded={isExpanded} />
          </AccordionButton>
          <AccordionPanel>
            <RadioGroup
              value={recommandation.selectedValue || "current"}
              onChange={onChangeParams}
            >
              <Stack>
                <Radio colorScheme={"brand"} value={"current"} size="sm">
                  Current:&nbsp;{recommandation.currentValue}
                </Radio>
                <Radio colorScheme={"brand"} value={"better"} size="sm">
                  More sober:&nbsp;{recommandation.betterValue}
                </Radio>
                {recommandation.bestValue && (
                  <Radio colorScheme={"brand"} value={"optimal"} size="sm">
                    Most sober:&nbsp;{recommandation.bestValue}
                  </Radio>
                )}
              </Stack>
            </RadioGroup>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  ) : null;
}
