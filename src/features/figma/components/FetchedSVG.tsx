import React from "react";
import SVG from "react-inlinesvg";
import { useDispatch } from "react-redux";

import {
  getAllZonesIdsOfTree,
  getNewTreeWithoutHiddenZones,
  getRelativePosition,
  getTreeHierarchyFromDOM,
  hashCode,
  REMOTE_PARENT_SVG_ID,
} from "../utils";
import { colorTheme } from "../../../theme";
import {
  allZonesReset,
  defaultFigmaZone,
  getSelectedFigmaZoneIds,
  zonesFilterByElementId,
  zonesSetTree,
  zonesUpdatedByElementId,
} from "../../zones/zonesSlice";
import { toast } from "../../..";
import { debounce } from "lodash";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Accordion,
  ModalBody,
  AccordionItem,
  AccordionButton,
} from "@chakra-ui/react";
import { useAppSelector } from "../../../app/hooks";
import { unfoldTree } from "../../../components/zones/MainGroupList";
import { TreeZoneEl } from "../../../app/types/types";

export const isNewImportedSvg = () => window.location.href.includes("new=true");
const displayToastWarning = debounce(() => {
  toast({
    title: "Warning",
    description: "The url to import the file is not valid",
    status: "warning",
    duration: 3000,
    isClosable: true,
  });
}, 1000);
export const getSvgUrlFromCurrentUrl = () => {
  // get current url
  const url = window.location.href;
  // find in the url bytesimBucket, region and key
  const bytesimBucket = url.match(/bytesimBucket=([^&]*)/)?.[1];
  const region = url.match(/region=([^&]*)/)?.[1];
  const key = url.match(/key=([^&]*)/)?.[1];

  // if some of the object are not defined return the default test url
  const defaultUrl =
    "https://bytesim-bucket.s3.eu-west-3.amazonaws.com/1350067722696166.5_bytesimname_bytesim_dev___Page_1.svg";
  // // TODO: to display a warning instead of using the default url after tests
  // if (!bytesimBucket || !region || !key) {
  //   displayToastWarning();
  //   return "";
  // }
  if (!bytesimBucket || !region || !key) return defaultUrl;

  // the url is formed like this https://bucket-name.s3.Region.amazonaws.com/key-name
  return `https://${bytesimBucket}.s3.${region}.amazonaws.com/${key}`;
};
const defaultFigmaZoneWithoutId = { ...defaultFigmaZone };
//@ts-ignore
delete defaultFigmaZoneWithoutId["id"];

const FetchedSVG = ({
  url = getSvgUrlFromCurrentUrl(), // "https://bytesim-bucket.s3.eu-west-3.amazonaws.com/0%253A1_Page%25201.svg",
}: {
  url?: string;
}) => {
  const idsRefs = React.useRef<string[]>([]);
  const dispatch = useDispatch();

  const zonesSlices = useAppSelector((store) => store.zonesSlice);

  const zones = zonesSlices?.zones.filter((z) => z.createdFrom === "figma");
  const firstChildrenTree = zonesSlices.tree?.[0]?.children;
  const openedZoneIds = useAppSelector(getSelectedFigmaZoneIds);

  const uniqueHash = `${hashCode(url)}`;
  const { isOpen: isModalOpen, onClose, onOpen } = useDisclosure();

  const onModalCloseValidate = () => {
    const newTree: TreeZoneEl = {
      id: zonesSlices.tree?.[0]?.id,
    };
    getNewTreeWithoutHiddenZones(firstChildrenTree, zones, newTree);
    const newZones = getAllZonesIdsOfTree(newTree);
    dispatch(allZonesReset());

    dispatch(zonesSetTree([newTree]));
    dispatch(zonesFilterByElementId(newZones));

    const displayedUrl = window.location.href
      ?.replace("&new=true", "")
      .replace("new=true", "");
    window.history.pushState({}, "", displayedUrl);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onModalCloseValidate}>
        <ModalOverlay bg={"blackAlpha.900"} />
        <ModalContent>
          <ModalHeader>{`Please hide the zones you don't want to import.`}</ModalHeader>
          <ModalBody display={"flex"} justifyContent="center" px={40}>
            {/* <MainGroupList key={"init_select"} /> */}
            <Accordion allowToggle defaultIndex={[0]} minW="400px" w="50vw">
              <AccordionItem isDisabled={false} pb={2} w="100%">
                <AccordionButton
                  minW="100%"
                  disabled={true}
                  _hover={{ cursor: "default" }}
                  _focus={{ boxShadow: "none" }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  pl={2}
                ></AccordionButton>

                {firstChildrenTree &&
                  unfoldTree(firstChildrenTree, zones, openedZoneIds)}
              </AccordionItem>
            </Accordion>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => onModalCloseValidate()}>Validate</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <SVG
        id={REMOTE_PARENT_SVG_ID}
        style={{ minWidth: "100%" }}
        cacheRequests={true}
        loader={<span>Loading...</span>}
        onError={(error) => console.log(error.message)}
        onLoad={(src, hasCache) => {
          // if new open modal select
          if (isNewImportedSvg()) {
            onOpen();
          } else if (zones?.length !== 0) {
            return;
          }
          const ids = idsRefs.current;
          // register all events on ids --> not needed anymore
          // registerHoverEventsOnFigmaEls(ids);

          // get tree hierarchy
          const tree = getTreeHierarchyFromDOM(ids);

          const allIdsWithourFirstElement = ids.slice(1);

          dispatch(
            zonesUpdatedByElementId(
              allIdsWithourFirstElement.map((elementId) => ({
                ...defaultFigmaZoneWithoutId,
                elementId,
                name: elementId?.replace(`__${uniqueHash}`, ""),
                ...getRelativePosition(elementId),
              }))
            )
          );
          dispatch(zonesSetTree(tree));
        }}
        preProcessor={(code) => {
          // code is a svg string
          // replace width parameter of svg tag by width="100%"
          const newCode = code
            // add id = removeSvgId to parent svg element
            // .replace(/<svg/g, `<svg id=${REMOTE_PARENT_SVG_ID}`)
            .replace(/width="[^"]+"/, 'width="100%"')
            //add svg tag attribute preserveAspectRatio="xMinYMin meet"
            .replace(/<svg/, '<svg preserveAspectRatio="xMinYMin meet"')
            // remove height parameter of svg tag
            .replace(/height="[^"]+"/, "")
            // add to the first g tag of svg tag a light gray border
            .replace(
              /<g/,
              `<g stroke="${colorTheme[900]}" stroke-width="2" stroke-linejoin="round"`
            );

          // the new code isolate the defs tag content
          const defsContent = newCode.match(/<defs>([\s\S]*)<\/defs>/)?.[1];
          //get all id of defs
          const idsDefs =
            defsContent
              ?.match(/id="[^"]+"/g)
              ?.map((id) => id.replace(/id="/, "").replace(/"/, "")) || [];

          // collect all the id of the svg element
          //remove id= and the double " at the beginning and the end of the string
          const ids = (code.match(/id="[^"]+"/g) ?? []).map((id) =>
            id.replace(/id="|"/g, "")
          );
          // remove noise from figma aka ids starting with "pattern", "filter", "paint", "Mask", "mask", "&#", "Atoms", "Ellipse", "Rectangle", "Circle", "Arrow"
          const filteredIds = ids
            .filter(
              (id) =>
                !id.startsWith("pattern") &&
                !id.startsWith("filter") &&
                !id.startsWith("paint") &&
                !id.startsWith("Mask") &&
                !id.startsWith("mask") &&
                !id.startsWith("&#") &&
                !id.startsWith("Atoms") &&
                !id.startsWith("Ellipse") &&
                !id.startsWith("Rectangle") && // do we filter these unamed ids by default?
                !id.startsWith("Circle") &&
                !id.startsWith("Arrow")
            )
            .filter((id) => !idsDefs.includes(id));
          // based on the ids create a tree structure, where each id belonging to a g tag of the svg is a parent node
          // and the ids of the children are the children of the parent node

          // get the ids of all the direct children of the first id

          idsRefs.current = filteredIds.map((id) => `${id}__${uniqueHash}`);

          return newCode;
        }}
        src={url}
        // **
        // unusued props
        // **
        // baseURL="/home"
        // description="The React logo"
        // title="React"
        uniqueHash={uniqueHash}
        uniquifyIDs={true}
      />
    </>
  );
};
export default FetchedSVG;
