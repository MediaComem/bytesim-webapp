import {
  Text,
  Flex,
  AccordionButton,
  Input,
  Button,
  Box,
} from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import React, { memo } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { Zone, ZoneOrigin, ZoneType } from "../../app/types/types";
import { colorTheme } from "../../theme";
import AccordionChevron from "../layout/AccordionChevron";
import { ReactComponent as OpenIcon } from "../../assets/Fleche_Fermee.svg";

import AccordionCustomTitle from "../layout/AccordionCustomTitle";
import ProgressPoints from "../layout/ProgressPoints";
import { ReactComponent as ResetIcon } from "../../assets/ResetIcon.svg";
import { ReactComponent as TrashIcon } from "../../assets/TEMP_trash.svg";

import { getTypeEntries } from "../../utils/utils";
import {
  zoneActiveToggled,
  zoneReset,
  zoneUpdated,
} from "../../features/zones/zonesSlice";
import { isEqual } from "lodash";
import { useIsNewImportedImage } from "../../features/importImage/components/FetchedImage";

interface ZoneListButtonProps {
  zone: Zone;
  createdFrom?: ZoneOrigin.FIGMA | ZoneOrigin.USER;
  onOpen?: () => void;
  isExpanded: boolean;
  buttonDelete?: any;
  hiddenMode?: boolean;
  setOpenedZoneId?: (id: string) => void;
  showChevronLeft?: boolean;
}

export const ZoneListButton = memo(function ZoneListBtn({
  zone,
  createdFrom,
  isExpanded,
  onOpen,
  buttonDelete,
  hiddenMode = false,
  showChevronLeft = true,
  setOpenedZoneId,
}: ZoneListButtonProps) {
  const dispatch = useDispatch();
  const projectStatus = useAppSelector((state) => state.project.status);
  const [value, setValue] = React.useState(zone.name);
  const [editNameMode, setEditNameMode] = React.useState(false);
  const [oldZoneName, setOldZoneName] = React.useState(zone.name);
  const updateZoneName = (newName: string) => {
    const newNameObject = {
      id: zone.id,
      name: newName,
    };
    if (value !== "") {
      setOldZoneName(newName);
      dispatch(zoneUpdated(newNameObject));
    } else {
      setValue(oldZoneName);
    }
    setEditNameMode(false);
  };
  const isNewImportImage = useIsNewImportedImage();
  const fallbackTypeZoneDisplayed = !isNewImportImage ? "- undefined" : "";

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="nowrap"
        pl={zone.createdFrom === "figma" ? 0 : 5}
        _hover={{
          backgroundColor: "brand.100",
          ".visibleOnHover": {
            visibility: "visible",
          },
        }}
        style={
          zone.status === "EDITING"
            ? { backgroundColor: colorTheme[100] }
            : undefined
        }
        onClick={() => {
          if (setOpenedZoneId) return setOpenedZoneId(zone.elementId ?? "");
          dispatch(zoneActiveToggled(zone.id));
        }}
      >
        <Flex align="center" justify="flex-start">
          {hiddenMode ? (
            <Box px={"6.5px"} py={"15px"} width="auto">
              <OpenIcon />
            </Box>
          ) : showChevronLeft ? (
            <AccordionButton m={0} p={1}>
              <AccordionChevron isExpanded={isExpanded} width="auto" />
            </AccordionButton>
          ) : (
            <></>
          )}
          <AccordionCustomTitle
            label={
              <>
                {editNameMode && !isNewImportImage ? (
                  <Input
                    value={value}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateZoneName(value ?? "");
                        setEditNameMode(false);
                      }
                      if (e.key === "Backspace") {
                        e.stopPropagation();
                      }
                    }}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    onBlur={() => {
                      updateZoneName(value ?? "");
                      setEditNameMode(false);
                    }}
                    autoFocus
                    p={1}
                    whiteSpace={"nowrap"}
                    minW="100px"
                  />
                ) : (
                  <Text
                    ml={1}
                    cursor={isNewImportImage ? "default" : "auto"}
                    whiteSpace={"nowrap"}
                    onDoubleClick={() => setEditNameMode(true)}
                  >
                    {value}
                  </Text>
                )}
              </>
            }
            size={"14"}
            icon={
              createdFrom && createdFrom === ZoneOrigin.FIGMA
                ? "importedGroup"
                : "drawnZone"
            }
            iconClassName={css({ transform: "scale(0.8)" })}
          />
          <Text fontSize={"sm"} color={"gray"} whiteSpace="nowrap" ml={2}>
            {zone.zoneType
              ? Object.entries(ZoneType)
                  .find((s) => s[0] === zone.zoneType)?.[1]
                  .replace(/[A-Z]/g, " $&")
                  .trim()
              : fallbackTypeZoneDisplayed}
          </Text>
          {zone.zoneType && (
            <ProgressPoints
              completeObject={getTypeEntries(zone.zoneType)}
              params={zone.params}
            />
          )}
        </Flex>
        <Flex className={cx("visibleOnHover ", css({ visibility: "hidden" }))}>
          {!hiddenMode && !isNewImportImage && (
            <Button
              variant={"ghost"}
              title="Reset zone"
              onClick={() => {
                dispatch(zoneReset(zone.id));
              }}
              isDisabled={projectStatus === "SIMULATION"}
            >
              <ResetIcon className={css({ margin: "3px" })} stroke="black" />
            </Button>
          )}
          {buttonDelete ?? (
            <Button
              variant={"ghost"}
              onClick={onOpen}
              title="Delete zone"
              isDisabled={projectStatus === "SIMULATION"}
            >
              <TrashIcon className={css({ margin: "3px" })} fill="black" />
            </Button>
          )}
        </Flex>
      </Box>
    </>
  );
},
isEqual);
