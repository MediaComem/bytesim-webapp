import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { figmaZoneSelector, useAppSelector } from "../../app/hooks";
import { FigmaTreeEl, ZoneFigma } from "../../app/types/types";
import { highlightFigmaZone } from "../../features/figma/utils";
import { zoneFigmaToggleHidden } from "../../features/figma/zonesFigmaSlice";
import AccordionChevron from "../layout/AccordionChevron";
import AccordionCustomTitle from "../layout/AccordionCustomTitle";
import { ZoneListButton } from "./ZoneListButton";
import ZoneParams from "./ZoneParams";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { colorTheme } from "../../theme";

export default function MainGroupList() {
  const figmaZones = useAppSelector(figmaZoneSelector);

  const zones = figmaZones?.zones;
  const tree = figmaZones.tree;

  return (
    <AccordionItem isDisabled={false} pb={2}>
      <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}>
        <AccordionChevron isExpanded={false} />
        <Box flex="1" textAlign="left">
          <AccordionCustomTitle label={"Main group"} icon="importedGroup" />
        </Box>
      </AccordionButton>

      {tree && unfoldTree(tree, zones)}
    </AccordionItem>
  );
}
const unfoldTree = (tree: FigmaTreeEl[], zones: ZoneFigma[]) => {
  return tree.map((t) => {
    const parentZone = zones.find((z) => z.id === t.id);
    if (parentZone?.hidden) {
      return <HiddenZone key={`${parentZone.id}_hidden`} z={parentZone} />;
    }
    return (
      <AccordionZones
        key={t.id}
        zones={zones.filter((z) => z.elementId === t.id)}
      >
        {t?.children?.length !== 0 && unfoldTree(t.children!, zones)}
      </AccordionZones>
    );
  });
};

const HiddenZone = ({ z }: { z: ZoneFigma }) => {
  const dispatch = useDispatch();

  return (
    <Box
      css={{
        filter: "contrast(0) opacity(0.3)",
      }}
      onMouseEnter={() => highlightFigmaZone(z.elementId)}
      onMouseLeave={() => highlightFigmaZone(z.elementId, false)}
    >
      <ZoneListButton
        zone={z}
        isExpanded={false}
        hiddenMode={true}
        buttonDelete={
          <Button
            variant={"ghost"}
            onClick={() => dispatch(zoneFigmaToggleHidden(z.id))}
            title="Delete zone"
            _hover={{}}
            isDisabled={false}
          >
            <ViewIcon css={{ margin: "3px" }} fill="black" />
          </Button>
        }
      />
    </Box>
  );
};
const AccordionZones = ({
  zones,
  children = null,
}: {
  zones: ZoneFigma[];
  children?: any;
}) => {
  const dispatch = useDispatch();

  return (
    <AccordionPanel
      p={0}
      pl={4}
      pr={0}
      overflow="auto"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
      }}
    >
      <Accordion allowToggle>
        {zones?.map((z) => {
          if (z.hidden) return <HiddenZone key={z.id + "_hidden"} z={z} />;
          return (
            <AccordionItem
              _hover={{ border: `1px solid ${colorTheme[100]}` }}
              border={`1px solid transparent`}
              key={z.id + "_hidden"}
            >
              {({ isExpanded }) => (
                <Box
                  onMouseEnter={() => highlightFigmaZone(z.elementId)}
                  onMouseLeave={() => highlightFigmaZone(z.elementId, false)}
                >
                  <ZoneListButton
                    zone={z}
                    buttonDelete={
                      <Button
                        variant={"ghost"}
                        onClick={() => dispatch(zoneFigmaToggleHidden(z.id))}
                        title="Delete zone"
                        isDisabled={false}
                      >
                        <ViewOffIcon css={{ margin: "3px" }} fill="black" />
                      </Button>
                    }
                    isExpanded={isExpanded}
                    //setOpen={() => toggleAccordion(i)}
                  />
                  <AccordionPanel p={0} bg={"brand.50"}>
                    <Box p={2} pl={12}>
                      <Heading size={"xs"}>Type</Heading>
                      <Text fontSize={"xs"}>Specific settings on the page</Text>
                    </Box>
                    <ZoneParams zone={z} />
                  </AccordionPanel>
                  {children}
                </Box>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </AccordionPanel>
  );
};
