import { Menu, MenuList, MenuItem } from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useSelectedZone } from "../../app/hooks";
import { zoneDeleted, zoneReset } from "../../features/zones/zonesSlice";

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
              <MenuItem onClick={() => dispatch(zoneReset(selectedZone.id))}>Reset</MenuItem>
              {/* <MenuItem>Rename</MenuItem> */}
              <MenuItem onClick={() => dispatch(zoneDeleted(selectedZone.id))}>
                Delete zone
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      )}
    </>
  );
}
