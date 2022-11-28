import { useAppSelector } from "../../app/hooks";
import { Image as ChakraImage, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getSvgUrlFromCurrentUrl } from "../../features/figma/components/FetchedSVG";
import { RootState } from "../../app/store";
import { ZONES_CONTAINER_WIDTH } from "../../services/const";

//GET image loaded into project
//Link project to S3 url -> one img/ project
type ZoneScreenshotProps = {
  zoneId: string;
};

const screenshotPadding = 10;

const ZoneScreenshot = ({ zoneId }: ZoneScreenshotProps) => {
  const zone = useAppSelector((state: RootState) =>
    state.zonesSlice.zones?.find((z) => z.id === zoneId)
  );

  const [zoneDim, setZoneDim] = useState({
    x: zone?.x || 0,
    y: zone?.y || 0,
    width: zone?.width || 0,
    height: zone?.height || 0,
  });
  const imageUrl = getSvgUrlFromCurrentUrl();

  useEffect(() => {
    if (!zone) return;

    const img = new Image();
    img.width = ZONES_CONTAINER_WIDTH;
    img.src = imageUrl;

    img.onload = () => {
      // add extra padding  if value are valid (not smaller than 0 and bigger than image height

      const paddingWidthToAdd = Math.max(
        0,
        Math.min(screenshotPadding, (img.width - zoneDim.width) / 2)
      );
      const paddingHeightToAdd = Math.max(
        0,
        Math.min(screenshotPadding, (img.height - zoneDim.height) / 2)
      );

      setZoneDim({
        x: zone.x - paddingWidthToAdd,
        y: zone.y - paddingHeightToAdd,
        width: zone.width + paddingWidthToAdd * 2,
        height: zone.height + paddingHeightToAdd * 2,
      });
    };
  }, [zone]);
  if (!zone) return <div />;

  return (
    <Box>
      <ChakraImage
        border="1px solid lightgray"
        objectFit="contain"
        src={`//images.weserv.nl/?url=${imageUrl}&w=${ZONES_CONTAINER_WIDTH}&cx=${zoneDim.x}&cy=${zoneDim.y}&cw=${zoneDim.width}&ch=${zoneDim.height}`}
        height="80px" /* fallbackSrc="/assets/placeholder.gif" */
      />
    </Box>
  );
};

//   return { ZoneScreenshot };
// };
export default ZoneScreenshot;
