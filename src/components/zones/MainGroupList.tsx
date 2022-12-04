import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { TreeZoneEl, Zone } from "../../app/types/types";
import { highlightFigmaZone } from "../../features/figma/utils";
import AccordionCustomTitle from "../layout/AccordionCustomTitle";
import { ZoneListButton } from "./ZoneListButton";
import ZoneParams from "./ZoneParams";

import { SmallAddIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { colorTheme } from "../../theme";
import {
  //getSelectedDrawnZoneIndex,
  getSelectedFigmaZoneIds,
  zoneToggleHidden,
} from "../../features/zones/zonesSlice";
import {
  isNewImportSvg,
  useIsNewImportedSvg,
} from "../../features/figma/components/FetchedSVG";
import AccordionItemTitleCustom from "../layout/AccordionItemTitleCustom";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function MainGroupList() {
  const zonesSlices = useAppSelector((store) => store.zonesSlice);
  const openedZoneIds = useAppSelector(getSelectedFigmaZoneIds);

  const zones = zonesSlices?.zones.filter((z) => z.createdFrom === "figma");
  const firstChildrenTree = zonesSlices.tree?.[0]?.children;
  // return null;

  return (
    <Accordion allowToggle defaultIndex={[0]}>
      <AccordionItem isDisabled={false} borderBottom={"none"}>
        {({ isExpanded }) => (
          <>
            {/*         <AccordionButton _hover={{ backgroundColor: "brand.100" }} pl={2}> */}
            {/* <AccordionChevron isExpanded={false} /> */}
            <Box flex="1" textAlign="left">
              <AccordionItemTitleCustom
                label={
                  <AccordionCustomTitle
                    label={"Main group"}
                    icon="importedGroup"
                  />
                }
                p={2}
                isExpanded={isExpanded}
              >
                <Button>
                  <Link to={"./figma"}>
                    <SmallAddIcon />
                  </Link>
                </Button>
              </AccordionItemTitleCustom>
            </Box>
            {/*   </AccordionButton> */}

            <UnfolTreeWrapper
              {...{ firstChildrenTree, zones, openedZoneIds }}
            />
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
}

let timeout: ReturnType<typeof setTimeout>;
// eslint-disable-next-line react/display-name
const UnfolTreeWrapper = React.memo(
  ({
    firstChildrenTree,
    zones,
    openedZoneIds,
  }: {
    firstChildrenTree: TreeZoneEl[] | undefined;
    zones: Zone[];
    openedZoneIds: string[];
  }) => {
    const isNewImportSvgHook = useIsNewImportedSvg();
    const [displayContent, setDisplayContent] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    // when isNewImportSvg change from true to false, wait 300ms before rendering the component (big SVG can take long to render the tree)
    useEffect(() => {
      if (isNewImportSvgHook) {
        setShowSpinner(false);
        return setDisplayContent(false);
      }

      setShowSpinner(true);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setDisplayContent(true);
        setShowSpinner(false);
      }, 300);

      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }, [isNewImportSvgHook]);

    // first render
    useEffect(() => {
      if (!isNewImportSvg()) {
        setDisplayContent(true);
        setShowSpinner(false);
      }
    }, []);

    return (
      <>
        {showSpinner && (
          <Flex mt={2} mb={5} justifyContent="center" alignItems="center">
            <Spinner />
          </Flex>
        )}
        {displayContent &&
          firstChildrenTree &&
          unfoldTree(
            firstChildrenTree,
            zones,
            isNewImportSvgHook ? [] : openedZoneIds
          )}
      </>
    );
  }
);

export const unfoldTree = (
  tree: TreeZoneEl[],
  zones: Zone[],
  openedZoneIds: string[],
  setOpenedZoneId?: (id: string) => void
) => {
  return tree?.map((t) => {
    const parentZone = zones.find((z) => z.id === t.id);
    if (parentZone?.hidden) {
      return <HiddenZone key={`${parentZone.id}_hidden`} z={parentZone} />;
    }
    const isExpanded = openedZoneIds.findIndex((zId) => zId === t.id) !== -1;

    return (
      <AccordionZones
        key={t.id}
        zones={zones.filter((z) => z.elementId === t.id)}
        openedZoneIds={openedZoneIds}
        setOpenedZoneId={setOpenedZoneId}
      >
        {isExpanded &&
          t?.children?.length !== 0 &&
          unfoldTree(t.children!, zones, openedZoneIds, setOpenedZoneId)}
      </AccordionZones>
    );
  });
};

const HiddenZone = ({ z }: { z: Zone }) => {
  const dispatch = useDispatch();

  return (
    <Box
      css={{
        filter: "opacity(0.3)",
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
            onClick={(e) => {
              dispatch(zoneToggleHidden(z.id));
              e?.stopPropagation();
            }}
            title="Hide zone"
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
  openedZoneIds,
  setOpenedZoneId,
}: {
  zones: Zone[];
  children?: any;
  openedZoneIds?: string[] | undefined;
  setOpenedZoneId?: (id: string) => void;
}) => {
  const dispatch = useDispatch();

  // check if openedZoneIds has one element in common with zones.map(z => z.id)
  const zoneExpanded = zones.findIndex((z) =>
    openedZoneIds?.includes(z.elementId ?? "")
  );
  return (
    <AccordionPanel
      p={0}
      pl={4}
      pr={0}
      overflow="auto"
      w="100%"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
      }}
    >
      <Accordion
        allowToggle
        // {...(zoneExpanded !== -1 && { index: zoneExpanded })}
        index={zoneExpanded}
      >
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
                        onClick={(e) => {
                          dispatch(zoneToggleHidden(z.id));
                          e?.stopPropagation();
                        }}
                        title="Hide zone and its children"
                        isDisabled={false}
                      >
                        <ViewOffIcon css={{ margin: "3px" }} fill="black" />
                      </Button>
                    }
                    isExpanded={isExpanded}
                    //setOpen={() => toggleAccordion(i)}
                    setOpenedZoneId={setOpenedZoneId}
                  />
                  {!isNewImportSvg() && (
                    <AccordionPanel p={0} bg={"brand.50"}>
                      <Box fontSize={12} pl={14}>
                        <Heading size="xs" fontSize="12px">
                          Type
                        </Heading>
                        <Text>Specific settings on the page</Text>
                      </Box>
                      <ZoneParams zone={z} />
                    </AccordionPanel>
                  )}
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
