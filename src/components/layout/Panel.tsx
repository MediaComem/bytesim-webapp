import { Flex, Heading, ResponsiveValue } from "@chakra-ui/react";
import { css } from "@emotion/css";
import * as React from "react";

interface PanelProps {
  title: string;
  toolbarButton?: React.ReactNode;
  className?: string;
  grow?: 1 | 0;
  children: React.ReactNode;
  id?: string;
  spinner?: React.ReactNode;
}

export default function Panel({
  title,
  toolbarButton,
  className,
  grow = 0,
  spinner,
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
      overflowX="auto"
    >
      <PanelTitle
        spinner={spinner}
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
  spinner?: React.ReactNode;
  className?: string;
}

function PanelTitle({
  title,
  toolbarButton,
  spinner,
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
        borderBottom="2px"
        borderColor="gray.200"
        minH="60px"
      >
        <>
          <Heading size={"16px"}>{title}</Heading>
          {spinner}
        </>
        {toolbarButton}
      </Flex>
    </>
  );
}
