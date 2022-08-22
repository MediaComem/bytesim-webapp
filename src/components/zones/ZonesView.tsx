import { Flex } from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import { useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import { useAppSelector } from "../../app/hooks";
import { zoneSelected, zoneUpdated } from "../../features/zones/zonesSlice";
import TestSVG from "../layout/TestSVG";

const zoneStyle = css({
  border: "3px solid violet",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
const selectedZoneStyle = css({
  border: "4px solid lightSeaGreen",
  fontWeight: "bold",
});

export default function ZonesView({
  disableEdition,
}: {
  disableEdition: boolean;
}) {
  const dispatch = useDispatch();
  const zones = useAppSelector((state) => state.zones);
  return (
    <Flex
      align={"flex-start"}
      justify={"flex-start"}
      pos={"relative"}
      p={6}
      overflow={"auto"}
      grow={1}
      alignSelf="stretch"
    >
      <div>
        <TestSVG />
      </div>
      {zones.map((z) => {
        return (
          <Rnd
            key={z.id}
            default={{
              x: z.x,
              y: z.y,
              width: z.width,
              height: z.height,
            }}
            className={cx(zoneStyle, {
              [selectedZoneStyle]: z.status === "EDITING",
            })}
            onMouseDown={() => dispatch(zoneSelected(z.id))}
            enableResizing={z.status === "EDITING" && !disableEdition}
            disableDragging={disableEdition}
            onResizeStop={(e, direction, ref, delta, position) => {
              const newZone = {
                id: z.id,
                x: position.x,
                y: position.y,
                width: z.width + delta.width,
                height: z.height + delta.height,
              };
              dispatch(zoneUpdated(newZone));
            }}
            onDragStop={(e, d) => {
              const newPos = {
                id: z.id,
                x: d.x,
                y: d.y,
              };
              dispatch(zoneUpdated(newPos));
            }}
          >
            {z.name}
          </Rnd>
        );
      })}
    </Flex>
  );
}
