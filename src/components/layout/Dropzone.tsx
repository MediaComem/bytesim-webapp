import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";

function Dropzone(props: {
  content: any;
  [x: string]: any;
  onDrop: (files: any) => void;
}) {
  const { content, onDrop } = props;
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      "image/svg": [".svg"],
      // allow any other kind of image
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
  });
  const bg = useColorModeValue("gray.100", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");
  return (
    <Flex
      align="center"
      justify="center"
      bg={bg}
      border="1px dashed"
      borderColor={borderColor}
      borderRadius="16px"
      w="100%"
      h="max-content"
      minH="100%"
      cursor="pointer"
      {...getRootProps({ className: "dropzone" })}
      //   {...rest}
    >
      <input {...getInputProps()} />
      <Button
        variant="no-effects"
        justifyContent="flex-start"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {content}
      </Button>
    </Flex>
  );
}

export default Dropzone;
