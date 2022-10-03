import {
  AccordionButton,
  BackgroundProps,
  Flex,
  SpaceProps,
} from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import * as React from "react";
import AccordionChevron from "./AccordionChevron";

interface AccordionItemTitleWithButtonProps
  extends SpaceProps,
    BackgroundProps {
  hoverBgColor?: string;
  label: string | React.ReactNode;
  children: React.ReactNode;
  hiddenButtons?: boolean;
  isExpanded: boolean;
}
export default function AccordionItemTitleCustom({
  label,
  children,
  bg,
  p,
  hoverBgColor,
  isExpanded,
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
      align="center"
    >
      <AccordionButton
        flexWrap="nowrap"
        _hover={{ backgroundColor: hoverBgColor || "brand.100" }}
        p={p}
      >
        <AccordionChevron isExpanded={isExpanded}/>
        {label}
      </AccordionButton>
      <div className={cx("visibleOnHover ", css({ visibility: "hidden" }))}>
        {children}
      </div>
    </Flex>
  );
}
