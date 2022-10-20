import { Divider, Flex, Heading, ResponsiveValue } from "@chakra-ui/react";
import { css } from "@emotion/css";
import * as React from "react";

interface PanelProps {
  title: string;
  toolbarButton?: React.ReactNode;
  className?: string;
  grow?: 1 | 0;
  children: React.ReactNode;
  id?: string;
}

export default function Panel({
  title,
  toolbarButton,
  className,
  grow = 0,
  children,
  id,
}: PanelProps) {
  return (
    <Flex
      flexDirection={"column"}
      className={className}
      alignSelf="stretch"
      grow={grow}
      id={id}
      overflow="auto"
    >
      <PanelTitle
        title={title}
        toolbarButton={toolbarButton}
        className={css({ overflowX: "auto" })}
      />
      {children}
    </Flex>
  );
}

interface PanelTitleProps {
  title: string;
  titleSize?: ResponsiveValue<
    (string & {}) | "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "3xl" | "xs"
  >;
  toolbarButton?: React.ReactNode;
  className?: string;
}

function PanelTitle({
  title,
  titleSize,
  toolbarButton,
  className,
}: PanelTitleProps) {
  return (
    <>
      <Flex
        className={className}
        align="center"
        alignSelf="stretch"
        justify={"space-between"}
        p={2}
      >
        <Heading size={titleSize || "sm"}>{title}</Heading>
        {toolbarButton}
      </Flex>
      <Divider />
    </>
  );
}
