import {
  Box,
  Flex,
  Heading,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { getGeneralEntryLabel } from "../../app/types/generalFormTypes";
import {
  BestPracticeMessage,
  RecommandationOption,
} from "../../app/types/recommandations";
import { recommandationUpdated } from "../../features/recommandations/recommandationsSlice";
import { capitalizeFirstLetter } from "../../utils/utils";
import { RecommandationType } from "./RecommandationsList";

interface BetterChoicesRecommandationProps {
  recommandation: RecommandationType;
}

export function BetterChoicesRecommandation({
  recommandation,
}: BetterChoicesRecommandationProps) {
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
          <Text>
            {recommandation.zoneId === "generic"
              ? capitalizeFirstLetter(
                  getGeneralEntryLabel(recommandation.parameter)
                )
              : capitalizeFirstLetter(recommandation.parameter)}
          </Text>
          {recommandation.bestPracticeMessage && (
            <>
              <Popover trigger="hover">
                <PopoverTrigger>
                  <div>ⓘ</div>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    <BPTooltipContent
                      recommandationBP={recommandation.bestPracticeMessage}
                    />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </>
          )}
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

interface BadPracticeRecommandationProps {
  recommandation: RecommandationType;
}

export function BadPracticeRecommandation({
  recommandation,
}: BadPracticeRecommandationProps) {
  return (
    <Box mb={2}>
      <Box flex="1" textAlign="left">
        <Flex>
          <Text>
            {recommandation.zoneId === "generic"
              ? capitalizeFirstLetter(
                  getGeneralEntryLabel(recommandation.parameter)
                )
              : capitalizeFirstLetter(recommandation.parameter)}
          </Text>
          {recommandation.bestPracticeMessage && (
            <Popover trigger="hover">
              <PopoverTrigger>
                <div>ⓘ</div>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                  <BPTooltipContent
                    recommandationBP={recommandation.bestPracticeMessage}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </Flex>
      </Box>
      <Text fontSize="sm" mt={1} color="red.600">
        {recommandation.message}
      </Text>
    </Box>
  );
}

interface TipRecommandationProps {
  recommandation: RecommandationType;
}

export function TipRecommandation({ recommandation }: TipRecommandationProps) {
  return (
    <Box mb={2}>
      <Box flex="1" textAlign="left">
        <Flex>
          <Text>{recommandation.parameter}</Text>
          <Text>
            {recommandation.zoneId === "generic"
              ? capitalizeFirstLetter(
                  getGeneralEntryLabel(recommandation.parameter)
                )
              : capitalizeFirstLetter(recommandation.parameter)}
          </Text>
          {recommandation.bestPracticeMessage && (
            <Popover trigger="hover">
              <PopoverTrigger>
                <div>ⓘ</div>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                  <BPTooltipContent
                    recommandationBP={recommandation.bestPracticeMessage}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </Flex>
      </Box>
      <Text fontSize="sm" mt={1} color="yellow.700">
        Tip: {recommandation.message}
      </Text>
    </Box>
  );
}

interface BPTooltipContentProps {
  recommandationBP: BestPracticeMessage;
  className?: string;
}
function BPTooltipContent({
  recommandationBP,
  className,
}: BPTooltipContentProps) {
  return (
    <Flex direction={"column"} className={className}>
      {recommandationBP.title && (
        <Heading size={"xs"}>{recommandationBP.title}</Heading>
      )}
      {recommandationBP.body && (
        <Text fontSize="xs">{recommandationBP.body}</Text>
      )}
      {recommandationBP.link && (
        <Link fontSize={"xs"} color="brand.500" fontWeight={600} href={recommandationBP.link} target='_blank'>
          Read more
        </Link>
      )}
    </Flex>
  );
}
