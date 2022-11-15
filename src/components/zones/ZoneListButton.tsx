import {
  Text,
  Flex,
  AccordionButton,
  Input,
  Button,
  Box,
} from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { Zone, ZoneType } from "../../app/types/types";
import { colorTheme } from "../../theme";
import AccordionChevron from "../layout/AccordionChevron";
import { ReactComponent as OpenIcon } from "../../assets/Fleche_Fermee.svg";

import AccordionCustomTitle from "../layout/AccordionCustomTitle";
import ProgressPoints from "../layout/ProgressPoints";
import { ReactComponent as ResetIcon } from "../../assets/ResetIcon_Active_MouseOver.svg";
import { ReactComponent as TrashIcon } from "../../assets/TEMP_trash.svg";

import { getTypeEntries } from "../../utils/utils";
import {
  zoneActiveToggled,
  zoneReset,
  zoneUpdated,
} from "../../features/zones/zonesSlice";

interface ZoneListButtonProps {
  zone: Zone;
  onOpen?: () => void;
  isExpanded: boolean;
  buttonDelete?: any;
  hiddenMode?: boolean;
}

export function ZoneListButton({
  zone,
  isExpanded,
  onOpen,
  buttonDelete,
  hiddenMode = false,
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
  const updateZone = (newZone: Partial<Zone>) => {
    return zoneUpdated(newZone);
  };
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
        onClick={() => dispatch(zoneActiveToggled(zone.id))}
      >
        <Flex align="center" justify="flex-start">
          {hiddenMode ? (
            <Box p={1}>
              <OpenIcon />
            </Box>
          ) : (
            <AccordionButton p={1} width="auto">
              <AccordionChevron isExpanded={isExpanded} />
            </AccordionButton>
          )}
          <AccordionCustomTitle
            label={
              <>
                {editNameMode ? (
                  <Input
                    value={value}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateZoneName(value ?? "");
                      }
                    }}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    onBlur={() => {
                      const newNameZone = {
                        id: zone.id,
                        name: value,
                      };
                      dispatch(updateZone(newNameZone));
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
                    //fontStyle={zone.zoneType ? "initial" : "italic"}
                    whiteSpace={"nowrap"}
                    onDoubleClick={() => setEditNameMode(true)}
                  >
                    {value}
                  </Text>
                )}
              </>
            }
            icon={"drawnZone"}
            iconClassName={css({ transform: "scale(0.8)" })}
          />
          <Text fontSize={"sm"} color={"gray"} whiteSpace="nowrap" ml={2}>
            {zone.zoneType
              ? Object.entries(ZoneType).find(
                  (s) => s[0] === zone.zoneType
                )?.[1]
              : "- undefined"}
          </Text>
          {zone.zoneType && (
            <ProgressPoints
              completeObject={getTypeEntries(zone.zoneType)}
              params={zone.params}
            />
          )}
        </Flex>
        <Flex className={cx("visibleOnHover ", css({ visibility: "hidden" }))}>
          {!hiddenMode && (
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
}
