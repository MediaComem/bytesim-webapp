import { useAppSelector } from "../app/hooks";
import { Image as ChakraImage, Box } from "@chakra-ui/react";

//GET image loaded into project
//CASE svg -> use parsing from branch figma-link to get correct content

//CASE img -> S3 url

export const useZone = () => {
  const zones = useAppSelector((state) => state.zones);

  const getZoneById = (zoneId: string) => {
    return zones.find((z) => z.id === zoneId);
  };

  type ZoneScreenshotProps = {
    zoneId: string;
  };

  const ZoneScreenshot = ({ zoneId }: ZoneScreenshotProps) => {
    const zone = getZoneById(zoneId);
    if (!zone) return <div />;

    const xPosition = zone.x - 24 > 0 ? zone.x - 24 : 0;
    const yPosition = zone.y - 24 > 0 ? zone.y - 24 : 0;
    const width = zone.width > 0 ? zone.width : 0;
    const height = zone.height > 0 ? zone.height : 0;
    //if image

    //400 is the max size of image in ZoneView
    //TODO: manage case < 400 -> see what happen
    const url = `//images.weserv.nl/?url=https://bytesim-bucket.s3.eu-west-3.amazonaws.com/RE-about.jpg&w=400&cx=${xPosition}&cy=${yPosition}&cw=${width}&ch=${height}"`;
    console.log(url);
    //if svg

    return (
      <Box py={2}>
        <ChakraImage
          src={url}
          height="80px" /* fallbackSrc="/assets/placeholder.gif" */
        />
      </Box>
    );
  };

  return { ZoneScreenshot };
};
