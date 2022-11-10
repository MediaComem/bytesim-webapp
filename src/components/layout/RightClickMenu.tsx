import { Menu, MenuList, MenuItem, useDisclosure } from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useSelectedZone } from "../../app/hooks";
import { zoneDeleted, zoneDuplicated, zoneReset } from "../../features/zones/zonesSlice";
import { DynamicModalParams } from "../zones/ZonesList";
import ConfirmModal, { confirmText } from "./ConfirmModal";

export interface RightClickMenuState {
  showMenu: boolean;
  xPos: string;
  yPos: string;
  zoneId?: string;
}

export const defaultRCMenuState = {
  showMenu: false,
  xPos: "0px",
  yPos: "0px",
};
interface RightClickMenuProps {
  className?: string;
}

export default function RightClickMenu({ className }: RightClickMenuProps) {
  const dispatch = useDispatch();
  const [state, setState] =
    React.useState<RightClickMenuState>(defaultRCMenuState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent, setModalContent] = React.useState<DynamicModalParams>({
    title: "",
    text: "",
    onConfirm: () => {},
  });
  const handleClick = () => {
    setState({
      ...state,
      showMenu: false,
    });
  };
  const selectedZone = useSelectedZone();
  const handleContextMenu = (event: MouseEvent) => {
    if (
      event.target instanceof Element &&
      event.target.classList.contains("rightClickable")
    ) {
      event.preventDefault();
      setState({
        showMenu: true,
        xPos: `${event.pageX}px`,
        yPos: `${event.pageY}px`,
      });
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <>
      <ConfirmModal
        texts={modalContent}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          modalContent.onConfirm();
          onClose();
        }}
      />
      {state.showMenu && selectedZone && (
        <div
          className={cx(
            css({
              position: "fixed",
              top: state.yPos,
              left: state.xPos,
              zIndex: 101,
            }),
            className
          )}
        >
          <Menu isOpen={state.showMenu}>
            <MenuList>
              <MenuItem
                onClick={() => {
                  setModalContent({
                    ...confirmText.resetZone,
                    onConfirm: () => {
                      dispatch(zoneReset(selectedZone.id));
                    },
                  });
                  onOpen();
                }}
              >
                Reset
              </MenuItem>
              <MenuItem
                onClick={() => {
                      dispatch(zoneDuplicated(selectedZone));
                }}
              >
                Duplicate
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setModalContent({
                    ...confirmText.deleteZone,
                    onConfirm: () => {
                      dispatch(zoneDeleted(selectedZone.id));
                    },
                  });
                  onOpen();
                }}
              >
                Delete zone
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      )}
    </>
  );
}
