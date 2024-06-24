import { memo, useRef, useCallback } from "react";
import SVG from "react-inlinesvg";
import { useDispatch } from "react-redux";

import {
  getAllZonesIdsOfTree,
  getNewTreeWithoutHiddenZones,
  getRelativePosition,
  getTreeHierarchyFromDOM,
  REMOTE_PARENT_ID,
} from "../utils";
import { colorTheme } from "../../../theme";
import {
  allZonesReset,
  defaultFigmaZone,
  zonesStoreResetInitalState,
  setIsNew,
  zonesFilterByElementId,
  zonesSetTree,
  zonesUpdatedByElementId,
  zoneAdded,
} from "../../zones/zonesSlice";
import { toast } from "../../..";
import { debounce, isEqual } from "lodash";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalBody,
  Image,
  Text,
} from "@chakra-ui/react";
import { useAppSelector } from "../../../app/hooks";
import { TreeZoneEl, Zone } from "../../../app/types/types";
import ModalSelectZonesContent from "./ModalSelectZonesContent";
import { useLocation, useNavigate } from "react-router-dom";
import ModalIndicationManualZones from "./ModalIndicationManualZones";
import { projectUpdated } from "../../project/projectSlice";

export const useIsNewImportedImage = () => {
  return useAppSelector((store) => store.zonesSlice?.isNew);
};
export const isNewImportImage = () => window.location.href.includes("new=true");

const displayToastWarning = debounce(() => {
  toast({
    title: "Warning",
    description: "The url to import the file is not valid",
    status: "warning",
    duration: 3000,
    isClosable: true,
  });
}, 1000);
export const getImageUrlFromCurrentUrl = () => {
  // get current url
  const url = window.location.href;
  // find in the url bytesimBucket, region and key
  const bytesimBucket = process.env.REACT_APP_S3_BUCKET;
  const region = process.env.REACT_APP_S3_REGION;
  const key = url.match(/key=([^&]*)/)?.[1];

  // ex URL "https://bytesim-bucket.s3.eu-west-3.amazonaws.com/1350067722696166.5_bytesimname_bytesim_dev___Page_1.svg";
  if (!bytesimBucket || !region || !key) {
    displayToastWarning();
    return "";
  }

  // the url is formed like this https://bucket-name.s3.Region.amazonaws.com/key-name
  return `https://${bytesimBucket}.s3.${region}.amazonaws.com/${key}`;
};
const defaultFigmaZoneWithoutId = { ...defaultFigmaZone };
//@ts-ignore
delete defaultFigmaZoneWithoutId["id"];

type FetchedProps = {
  url: string;
  onLoaded?: (src: string) => void;
  onModalValidateClose: () => void;
};

const FetchedImage = memo(function FetchedImage({
  url = getImageUrlFromCurrentUrl(), // "https://bytesim-bucket.s3.eu-west-3.amazonaws.com/0%253A1_Page%25201.svg",
  onLoaded: onLoadedProps,
}: Partial<FetchedProps>) {
  useLocation();
  const dispatch = useDispatch();
  const isImageSvg = url?.endsWith(".svg");

  const onLoaded = useCallback(() => {
    onLoadedProps?.(url);
    dispatch(projectUpdated({ imageType: isImageSvg ? "svg" : "other" }));
  }, [url, isImageSvg, dispatch]);

  const { search } = useLocation(); // keep image params
  const navigate = useNavigate();

  const newParams = search?.replace("&new=true", "").replace("new=true", "");

  const onModalValidateClose = useCallback(() => {
    navigate(`/figma${newParams}`, { replace: true });
    dispatch(setIsNew(false));
  }, [navigate, newParams, dispatch]);

  if (isImageSvg) {
    return (
      <FetchedSvg
        url={url}
        onLoaded={onLoaded}
        onModalValidateClose={onModalValidateClose}
      />
    );
  }
  return (
    <FetchedImageNonSvg
      url={url}
      onLoaded={onLoaded}
      onModalValidateClose={onModalValidateClose}
    />
  );
});

const FetchedImageNonSvg = memo(function FetchedImageNonSvg({
  url,
  onLoaded,
  onModalValidateClose,
}: FetchedProps) {
  const dispatch = useDispatch();
  const { isOpen: isModalOpen, onClose, onOpen } = useDisclosure();

  const onClose_ = useCallback(() => {
    dispatch(allZonesReset());
    onClose();

    setTimeout(() => {
      dispatch(zonesStoreResetInitalState());
      onModalValidateClose();
      dispatch(zoneAdded());
    });
  }, [onClose, onModalValidateClose, dispatch]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onClose_}>
        <ModalOverlay bg={"blackAlpha.900"} />
        <ModalContent minW="50vw">
          <ModalHeader>{`Image successfuly imported!`}</ModalHeader>
          <ModalBody
            display={"flex"}
            justifyContent="center"
            px={2}
            flexDir="column"
          >
            <Image mb={8} alignSelf={"center"} src={url} w="30%"></Image>
            <Text mb={8}>
              The next step is to draw some zones on your image to analyze them
              as in the example
            </Text>
            <ModalIndicationManualZones />
          </ModalBody>
          <ModalFooter>
            <Button color="green.300" onClick={onClose_}>
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Image
        id={REMOTE_PARENT_ID}
        minW={"100%"}
        src={url}
        onLoad={() => {
          onLoaded?.(url);
          if (isNewImportImage()) {
            dispatch(setIsNew(true));
            onOpen();
          }
        }}
      ></Image>
    </>
  );
});
const FetchedSvg = function FetchedSvg({
  url, // "https://bytesim-bucket.s3.eu-west-3.amazonaws.com/0%253A1_Page%25201.svg",
  onLoaded,
  onModalValidateClose,
}: FetchedProps) {
  const idsRefs = useRef<string[]>([]);
  const dispatch = useDispatch();

  // prevent useless renders by switching a zone status
  const zones: Zone[] = useAppSelector(
    (store) =>
      store.zonesSlice.zones
        .filter((z) => z.createdFrom === "figma")
        .map((z) => ({ ...z, status: "ACTIVE" })),
    isEqual
  );
  const tree = useAppSelector((store) => store.zonesSlice.tree);

  const firstChildrenTree = tree?.[0]?.children;

  const uniqueHash = `svg_elements_to_parse`;
  const { isOpen: isModalOpen, onClose, onOpen } = useDisclosure();

  const onModalCloseValidate = () => {
    const newTree: TreeZoneEl = {
      id: tree?.[0]?.id,
    };
    getNewTreeWithoutHiddenZones(firstChildrenTree, zones, newTree);
    const newZones = getAllZonesIdsOfTree(newTree);
    dispatch(allZonesReset());
    onClose();

    setTimeout(() => {
      dispatch(zonesSetTree([newTree]));
      dispatch(zonesFilterByElementId(newZones));
      onModalValidateClose();
    }, 300);
  };
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onModalCloseValidate}>
        <ModalOverlay bg={"blackAlpha.900"} />
        <ModalContent minW="50vw">
          <ModalHeader>{`Please hide the zones you don't want to import.`}</ModalHeader>
          <ModalBody display={"flex"} justifyContent="center" px={2}>
            <ModalSelectZonesContent
              zones={zones}
              firstChildrenTree={firstChildrenTree}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => onModalCloseValidate()}>Validate</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <SVG
        id={REMOTE_PARENT_ID}
        style={{ minWidth: "100%" }}
        cacheRequests={true}
        loader={<span>Loading...</span>}
        onError={(error) => console.log(error.message)}
        onLoad={(src) => {
          onLoaded?.(src);
          // if new open modal select
          if (isNewImportImage()) {
            dispatch(setIsNew(true));
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
            // .replace(/<svg/g, `<svg id=${REMOTE_PARENT_ID}`)
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
export default FetchedImage;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useOnModalValidateClose() {
  const dispatch = useDispatch();
  const { search } = useLocation(); // keep image params
  const navigate = useNavigate();

  const newParams = search?.replace("&new=true", "").replace("new=true", "");

  return function onModalClose() {
    navigate(`/figma${newParams}`, { replace: true });
    dispatch(setIsNew(false));
  };
  // return useCallback(function onModalClose() {
  // navigate(`/figma${newParams}`, { replace: true });
  // dispatch(setIsNew(false));
  // }, []);
}
