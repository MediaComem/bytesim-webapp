import { AccordionButton, AccordionIcon, Flex } from "@chakra-ui/react";
import * as React from "react";
interface AccordionItemWithButtonProps {
  bg?: string;
  hoverBgColor?: string;
  label: string | React.ReactNode;
  children: React.ReactNode;
}
export default function AccordionItemWithButton({
  label,
  children,
  bg,
  hoverBgColor,
}: AccordionItemWithButtonProps) {
  return (
    <Flex bg={bg} _hover={{ backgroundColor: hoverBgColor || "brand.100" }}>
      <AccordionButton
        flexWrap="nowrap"
        _hover={{ backgroundColor: hoverBgColor || "brand.100" }}
      >
        <AccordionIcon />
        {label}
      </AccordionButton>
      {children}
    </Flex>
  );
}
