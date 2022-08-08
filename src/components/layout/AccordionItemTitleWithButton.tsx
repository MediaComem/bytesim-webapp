import { AccordionButton, AccordionIcon, BackgroundProps, Flex, SpaceProps } from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import * as React from "react";
interface AccordionItemTitleWithButtonProps extends SpaceProps, BackgroundProps {
  hoverBgColor?: string;
  label: string | React.ReactNode;
  children: React.ReactNode;
  hiddenButtons?: boolean;
}
export default function AccordionItemTitleWithButton({
  label,
  children,
  bg,
  p,
  hoverBgColor,
}: AccordionItemTitleWithButtonProps) {
  return (
    <Flex
      bg={bg}
      _hover={{
        backgroundColor: hoverBgColor || "brand.100",
        ".visibleOnHover": {
          visibility: "visible",
        },
      }}
      align='center'
    >
      <AccordionButton
        flexWrap="nowrap"
        _hover={{ backgroundColor: hoverBgColor || "brand.100" }}
        p={p}
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
