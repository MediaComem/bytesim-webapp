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
import { TreeZoneEl, Zone, ZoneOrigin } from "../../app/types/types";

import AccordionCustomTitle from "../layout/AccordionCustomTitle";
import { ZoneListButton } from "./ZoneListButton";
import ZoneParams from "./ZoneParams";
import { ReactComponent as ShowIcon } from "../../assets/Show.svg";
import { ReactComponent as HideIcon } from "../../assets/Hide.svg";
import { colorTheme } from "../../theme";
import {
  //getSelectedDrawnZoneIndex,
  getSelectedFigmaZoneIds,
  zoneToggleHidden,
} from "../../features/zones/zonesSlice";
import {
  isNewImportImage,
  useIsNewImportedImage,
} from "../../features/importImage/components/FetchedImage";
import AccordionItemTitleCustom from "../layout/AccordionItemTitleCustom";
import React, { useState, useEffect } from "react";
import { isEqual } from "lodash";
import {
  getOpenedZonesOfTree,
  highlightFigmaZone,
} from "../../features/importImage/utils";

export default function MainGroupList() {
  const isImageSvg = useAppSelector(
    (store) => store.project.imageType === "svg"
  );
  if (!isImageSvg) return null;
  return (
    <Accordion allowToggle defaultIndex={[0]}>
      <AccordionItem isDisabled={false} borderBottom={"none"}>
        {({ isExpanded }) => (
          <>
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
              />
            </Box>

            <UnfoldedTreeWrapper />
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
}

let timeout: ReturnType<typeof setTimeout>;
// eslint-disable-next-line react/display-name
const UnfoldedTreeWrapper = React.memo(() => {
  const zones = useAppSelector(
    (store) => store.zonesSlice.zones.filter((z) => z.createdFrom === "figma"),
    isEqual
  );
  const firstChildrenTree = useAppSelector(
    (store) => store.zonesSlice.tree?.[0]?.children,
    isEqual
  );
  const openedZoneIds = useAppSelector(getSelectedFigmaZoneIds);

  const isNewImportSvgHook = useIsNewImportedImage();
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
    if (!isNewImportImage()) {
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
      {displayContent && firstChildrenTree && (
        <UnfoldedTree
          tree={firstChildrenTree}
          zones={zones}
          openedZoneIds={isNewImportSvgHook ? [] : openedZoneIds}
        />
      )}
    </>
  );
});

export const UnfoldedTree = ({
  tree,
  zones,
  openedZoneIds,
  setOpenedZoneId,
  showChevronLeftIfNoChildren = true,
}: {
  tree: TreeZoneEl[];
  zones: Zone[];
  openedZoneIds: string[];
  setOpenedZoneId?: (id: string) => void;
  showChevronLeftIfNoChildren?: boolean;
}) => {
  return (
    <div>
      {tree?.map((t) => {
        const { openedZonesIdsOfTree, zonesOfTree } = getOpenedZonesOfTree(
          t,
          zones,
          openedZoneIds
        );
        return (
          <UnfoldedTreeChild
            key={t.id}
            // zones={zones}
            zones={zonesOfTree}
            treeZoneEl={t}
            openedZoneIds={openedZonesIdsOfTree}
            setOpenedZoneId={setOpenedZoneId}
            showChevronLeftIfNoChildren={showChevronLeftIfNoChildren}
          />
        );
      })}
    </div>
  );
};

const UnfoldedTreeChild = React.memo(function UnfoldedTreeChildComp({
  zones,
  treeZoneEl,
  openedZoneIds,
  setOpenedZoneId,
  showChevronLeftIfNoChildren = true,
}: {
  treeZoneEl: TreeZoneEl;
  zones: Zone[];
  openedZoneIds: string[];
  setOpenedZoneId?: (id: string) => void;
  showChevronLeftIfNoChildren?: boolean;
}) {
  const t = treeZoneEl;
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
      showChevronLeft={showChevronLeftIfNoChildren || t?.children?.length !== 0}
    >
      {isExpanded && t?.children?.length !== 0 && (
        <UnfoldedTree
          tree={t.children!}
          zones={zones}
          openedZoneIds={openedZoneIds}
          setOpenedZoneId={setOpenedZoneId}
          showChevronLeftIfNoChildren={showChevronLeftIfNoChildren}
        />
      )}
    </AccordionZones>
  );
},
isEqual);

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
            <Box m={3}>
              <ShowIcon />
            </Box>
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
  showChevronLeft = true,
}: {
  zones: Zone[];
  children?: any;
  openedZoneIds?: string[] | undefined;
  setOpenedZoneId?: (id: string) => void;
  showChevronLeft?: boolean;
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
                    createdFrom={ZoneOrigin.FIGMA}
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
                        <Box m={3}>
                          <HideIcon />
                        </Box>
                      </Button>
                    }
                    isExpanded={isExpanded}
                    //setOpen={() => toggleAccordion(i)}
                    setOpenedZoneId={setOpenedZoneId}
                    showChevronLeft={showChevronLeft}
                  />
                  {!isNewImportImage() && (
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
