import { Flex } from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import { useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import { useAppSelector } from "../../app/hooks";
import { zoneSelected, zoneUpdated } from "../../features/zones/zonesSlice";
import TestSVG from "../layout/TestSVG";
const brandColor = '#ea62ea';
const resizeHandleSVG = (<svg width="15" height="15" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="7" y="7" width="14" height="14" fill="white" stroke={brandColor} strokeWidth="2"/>
</svg>
);
const handleComp = {
  topRight: resizeHandleSVG,
  bottomRight: resizeHandleSVG,
  bottomLeft: resizeHandleSVG,
  topLeft: resizeHandleSVG,
}
const zoneStyle = css({
  border: `2px solid ${brandColor}55`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: `${brandColor}09`,
  color: `${brandColor}`
});
const selectedZoneStyle = css({
  border: `2px solid ${brandColor}`,
  fontWeight: "bold",
});
const aboveZoneStyle = css({
  marginTop: '-20px',
  whiteSpace: 'nowrap',
  fontSize: '0.85em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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
            resizeHandleComponent={handleComp}
          >
            <p className={aboveZoneStyle}>{z.name}</p>
          </Rnd>
        );
      })}
    </Flex>
  );
}
