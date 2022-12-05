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
  Text,
} from "@chakra-ui/react";
import { css } from "@emotion/css";
import React from "react";
import { useDispatch } from "react-redux";
import { getGeneralEntryLabel } from "../../app/types/generalFormTypes";
import {
  BestPracticeMessage,
  RecommandationOption,
} from "../../app/types/recommandations";
import { recommandationUpdated } from "../../features/recommandations/recommandationsSlice";
import { colorTheme } from "../../theme";
import { capitalizeFirstLetter } from "../../utils/utils";
import { RecommandationType } from "./RecommandationsList";

interface BetterChoicesRecommandationProps {
  recommandation: RecommandationType;
}

export function BetterChoicesRecommandation({
  recommandation,
}: BetterChoicesRecommandationProps) {
  const dispatch = useDispatch();
  //const [value, setValue] = React.useState('')

  const onChangeParams = React.useCallback(
    (v: RecommandationOption) => {
      dispatch(
        recommandationUpdated({ id: recommandation.id, selectedValue: v })
      );
    },
    [recommandation]
  );

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeParams(e.target.value as RecommandationOption);
  };

  return (
    <Box mb={1} pl={6}>
      <Box flex="1" textAlign="left">
        <Flex align={"center"} gap={1}>
          <Text fontSize={"xs"} fontWeight={700}>
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
      <Flex gap={1} fontSize={"xs"}>
        <input
          type="radio"
          name={"current" + recommandation.id}
          value={"current"}
          id={"current" + recommandation.id}
          checked={recommandation.selectedValue ? recommandation.selectedValue === 'current' : true}
          onChange={handleEventChange}
          className={css({ accentColor: `${colorTheme[500]}` })}
        />
        <label htmlFor={"current" + recommandation.id}>
          Current:&nbsp;{recommandation.currentValue}
        </label>
      </Flex>
      <Flex gap={1} fontSize={"xs"}>
        <input
          type="radio"
          name={"better" + recommandation.id}
          value={"better"}
          id={"better" + recommandation.id}
          checked={recommandation.selectedValue === "better"}
          onChange={handleEventChange}
          className={css({ accentColor: `${colorTheme[500]}` })}
        />
        <label htmlFor={"better" + recommandation.id}>
        More sober:&nbsp;{recommandation.betterValue}
        </label>
      </Flex>
      {recommandation.bestValue && (
      <Flex gap={1} fontSize={"xs"}>
        <input
          type="radio"
          name={"optimal" + recommandation.id}
          value={"optimal"}
          id={"optimal" + recommandation.id}
          checked={recommandation.selectedValue === "optimal"}
          onChange={handleEventChange}
          className={css({ accentColor: `${colorTheme[500]}` })}
        />
        <label htmlFor={"optimal" + recommandation.id}>
          Most sober:&nbsp;{recommandation.bestValue}
        </label>
      </Flex>)}
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
    <Box mb={2} pl={6}>
      <Box flex="1" textAlign="left">
        <Flex align={"center"} gap={1}>
          <Text fontSize={"xs"} fontWeight={700}>
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
      <Text fontSize="xs" color="red.600" mt={0}>
        Warning: {recommandation.message}
      </Text>
    </Box>
  );
}

interface TipRecommandationProps {
  recommandation: RecommandationType;
}

export function TipRecommandation({ recommandation }: TipRecommandationProps) {
  return (
    <Box mb={2} pl={6}>
      <Box flex="1" textAlign="left">
        <Flex align={"center"} gap={1}>
          <Text fontSize={"xs"} fontWeight={700}>
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
      <Text fontSize="xs" color="yellow.700">
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
