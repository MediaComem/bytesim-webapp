import { useAppZones } from "../app/hooks";
import { Image as ChakraImage, Box } from "@chakra-ui/react";
import { useState } from "react";
import { getSvgUrlFromCurrentUrl } from "../features/figma/components/FetchedSVG";

//GET image loaded into project
//Link project to S3 url -> one img/ project
type ZoneScreenshotProps = {
  zoneId: string;
};
const useZoneScreenshot = () => {
  const zones = useAppZones();

  const getZoneById = (zoneId: string) => {
    return zones.find((z) => z.id === zoneId);
  };

  const ZoneScreenshot = ({ zoneId }: ZoneScreenshotProps) => {
    const [imgWidth, setImgWidth] = useState(400);
    const zone = getZoneById(zoneId);
    if (!zone) return <div />;

    const xPosition = zone.x - 24 > 0 ? zone.x - 24 : 0;
    const yPosition = zone.y - 24 > 0 ? zone.y - 24 : 0;
    const width = zone.width > 0 ? zone.width : 0;
    const height = zone.height > 0 ? zone.height : 0;

    const imageUrl = getSvgUrlFromCurrentUrl();

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      if (img.width < 400) {
        setImgWidth(img.width);
      }
    };

    return (
      <Box py={2}>
        <ChakraImage
          objectFit="contain"
          src={`//images.weserv.nl/?url=${imageUrl}&w=${imgWidth}&cx=${xPosition}&cy=${yPosition}&cw=${width}&ch=${height}"`}
          height="80px" /* fallbackSrc="/assets/placeholder.gif" */
        />
      </Box>
    );
  };

  return { ZoneScreenshot };
};
export default useZoneScreenshot;
