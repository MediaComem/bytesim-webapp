import { useAppSelector } from "../app/hooks";
import { Image as ChakraImage, Box } from "@chakra-ui/react";
import { useState } from "react";

//GET image loaded into project
//Link project to S3 url -> one img/ project

export const useZone = () => {
  const zones = useAppSelector((state) => state.zones);

  const getZoneById = (zoneId: string) => {
    return zones.find((z) => z.id === zoneId);
  };

  type ZoneScreenshotProps = {
    zoneId: string;
  };

  const ZoneScreenshot = ({ zoneId }: ZoneScreenshotProps) => {
    const [imgWidth, setImgWidth] = useState(400);
    const zone = getZoneById(zoneId);
    if (!zone) return <div />;

    const xPosition = zone.x - 24 > 0 ? zone.x - 24 : 0;
    const yPosition = zone.y - 24 > 0 ? zone.y - 24 : 0;
    const width = zone.width > 0 ? zone.width : 0;
    const height = zone.height > 0 ? zone.height : 0;

    const imageUrl =
      "https://bytesim-bucket.s3.eu-west-3.amazonaws.com/test.svg";
    // const imageUrl =
    //   "https://bytesim-bucket.s3.eu-west-3.amazonaws.com/RE-about.jpg";

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
          src={`//images.weserv.nl/?url=${imageUrl}&w=${imgWidth}&cx=${xPosition}&cy=${yPosition}&cw=${width}&ch=${height}"`}
          height="80px" /* fallbackSrc="/assets/placeholder.gif" */
        />
      </Box>
    );
  };

  return { ZoneScreenshot };
};
