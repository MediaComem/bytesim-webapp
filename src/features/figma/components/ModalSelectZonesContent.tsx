import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TreeZoneEl, Zone } from "../../../app/types/types";
import { UnfoldedTree } from "../../../components/zones/MainGroupList";
import { isNewImportSvg, useIsNewImportedSvg } from "./FetchedSVG";

const ModalSelectZonesContent = ({
  zones,
  firstChildrenTree,
}: {
  zones: Zone[];
  firstChildrenTree?: TreeZoneEl[];
}) => {
  const [openedZoneIds, setOpenedZoneIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const isNewSvg = useIsNewImportedSvg();
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 300);
  }, []);

  const setOpenedZoneId = (id: string) => {
    // if zone id is already in openedZoneIds remove it else add it
    const foundIndex = openedZoneIds.findIndex((zId) => zId === id);
    if (foundIndex !== -1) {
      const newZonesIds = [...openedZoneIds];
      newZonesIds.splice(foundIndex, 1);
      setOpenedZoneIds(newZonesIds);
    } else setOpenedZoneIds([...openedZoneIds, id]);
  };
  return (
    <Accordion allowToggle defaultIndex={[0]} minW="400px">
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
        {mounted && isNewSvg && firstChildrenTree && (
          <UnfoldedTree
            tree={firstChildrenTree}
            zones={zones}
            openedZoneIds={openedZoneIds}
            setOpenedZoneId={setOpenedZoneId}
          />
        )}
        {!mounted && (
          <Flex justifyContent="center" py={10}>
            <Spinner />
          </Flex>
        )}
      </AccordionItem>
    </Accordion>
  );
};
export default ModalSelectZonesContent;
