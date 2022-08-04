import { AccordionButton, AccordionIcon, Flex } from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import * as React from "react";
interface AccordionItemWithButtonProps {
  bg?: string;
  hoverBgColor?: string;
  label: string | React.ReactNode;
  children: React.ReactNode;
  hiddenButtons?: boolean;
}
export default function AccordionItemWithButton({
  label,
  children,
  bg,
  hoverBgColor,
}: AccordionItemWithButtonProps) {
  return (
    <Flex
      bg={bg}
      _hover={{
        backgroundColor: hoverBgColor || "brand.100",
        ".visibleOnHover": {
          visibility: "visible",
        },
      }}
    >
      <AccordionButton
        flexWrap="nowrap"
        _hover={{ backgroundColor: hoverBgColor || "brand.100" }}
      >
        <AccordionIcon />
        {label}
      </AccordionButton>
      <div className={cx("visibleOnHover ", css({ visibility: "hidden" }))}>
        {children}
      </div>
    </Flex>
  );
}
