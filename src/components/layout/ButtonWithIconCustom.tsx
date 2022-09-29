import { Box, Button, ButtonProps, Flex, Text } from "@chakra-ui/react";
import * as React from "react";

interface ButtonWithIconCustomProps extends ButtonProps {
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  iconAfter?: boolean;
}
export default function ButtonWithIconCustom({
  icon,
  label,
  subLabel,
  iconAfter,
  variant,
  onClick,
  disabled,
}: ButtonWithIconCustomProps) {
  return (
    <Button
      fontSize="xs"
      variant={variant || 'outline'}
      borderRadius={0}
      display="block"
      height={"auto"}
      px={4}
      py={2}
      onClick={onClick}
      _hover={{ backgroundColor: "brand.100" }}
      disabled={disabled}
    >
      <Flex>
        <>
          {!iconAfter && (
            <Box mr={2} mt={1}>
              {icon}
            </Box>
          )}
          <Flex align={iconAfter ? "flex-end" : "flex-start"} direction="column">
            <Text fontSize={"md"}>{label}</Text>
            <Text fontSize={"xs"} whiteSpace="break-spaces" textAlign={"left"}>
              {subLabel}
            </Text>
          </Flex>
          {iconAfter && (
            <Box ml={2} mt={1}>
              {icon}
            </Box>
          )}
        </>
      </Flex>
    </Button>
  );
}
