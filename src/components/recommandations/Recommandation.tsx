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
    </Box>
  );
}
