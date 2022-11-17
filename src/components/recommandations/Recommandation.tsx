import {
  Box,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { RecommandationOption } from "../../app/types/recommandations";
import { recommandationUpdated } from "../../features/recommandations/recommandationsSlice";
import { RecommandationType } from "./RecommandationsList";

interface RecommandationDisplayProps {
  recommandation: RecommandationType;
}

export default function RecommandationDisplay({
  recommandation,
}: RecommandationDisplayProps) {
  //const { totalBenefits, setTotalBenefits } = React.useContext(ReportCTX);
  const dispatch = useDispatch();

  const onChangeParams = React.useCallback(
    (v: RecommandationOption) => {
      dispatch(
        recommandationUpdated({ id: recommandation.id, selectedValue: v })
      );
    },
    [recommandation]
  );

  return (
    <Box mb={2}>
      <Box flex="1" textAlign="left">
        <Flex>
          <Text>{recommandation.parameter}</Text>
          <Tooltip label="Biblio de reco + best practices" hasArrow>
            ⓘ
          </Tooltip>
        </Flex>
      </Box>
      <RadioGroup
        value={recommandation.selectedValue || "current"}
        onChange={onChangeParams}
      >
        <Stack>
          <Radio colorScheme={"brand"} value={"current"} size="sm">
            {`Current: ${recommandation.currentValue}`}
          </Radio>
          {recommandation.betterValue && (
            <Radio colorScheme={"brand"} value={"better"} size="sm">
              <Flex>
                <Text>{`More sober: ${recommandation.betterValue}`}</Text>
                <Text
                  ml={2}
                  color="green.600"
                >{`-${recommandation.benefitsBetter?.co2.toFixed(
                  0
                )}kg Co2eq`}</Text>
              </Flex>
            </Radio>
          )}
          {recommandation.bestValue && (
            <Radio colorScheme={"brand"} value={"optimal"} size="sm">
              <Flex>
                <Text>{`Most sober: ${recommandation.bestValue}`}</Text>
                <Text
                  ml={2}
                  color="green.600"
                >{`-${recommandation.benefitsBest?.co2.toFixed(
                  0
                )}kg Co2eq`}</Text>
              </Flex>
            </Radio>
          )}
        </Stack>
      </RadioGroup>
    </Box>
  );
}
