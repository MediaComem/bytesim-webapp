import { Box, Image } from "@chakra-ui/react";

export default function ModalIndicationManualZones() {
  return (
    <Box borderWidth={1} borderColor="grey.800">
      <Image
        objectFit="cover"
        src={require("../../../assets/example_add_zones_manually.png")}
      />
    </Box>
  );
}
