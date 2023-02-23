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
  onClick,
  disabled,
}: ButtonWithIconCustomProps) {
  return (
    <Button
      fontSize="xs"
      variant={"outline"}
      mr={2}
      display="block"
      height={"auto"}
      px={4}
      py={2}
      onClick={onClick}
      disabled={disabled}
    >
      <Flex alignItems={"center"}>
        <>
          {!iconAfter && <Box mr={2}>{icon}</Box>}
          <Flex alignItems={"center"}>
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
