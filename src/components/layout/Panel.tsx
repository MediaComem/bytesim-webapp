import { Divider, Flex, Heading, ResponsiveValue } from "@chakra-ui/react";
import { cx, css } from "@emotion/css";
import { Resizable } from "re-resizable";
import * as React from "react";

const panelStyle = css({
  border: "1px solid gray",
});

interface PanelProps {
  title: string;
  toolbarButton?: React.ReactNode;
  className?: string;
  grow?: 1 | 0;
  children: React.ReactNode;
}

export default function Panel({
  title,
  toolbarButton,
  className,
  grow = 0,
  children,
}: PanelProps) {
  return (
    <Flex
      flexDirection={"column"}
      className={cx(panelStyle, className)}
      alignSelf="stretch"
      grow={grow}
    >
    <PanelTitle title={title} toolbarButton={toolbarButton} />
      {children}
    </Flex>
  );
}

interface ResizablePanelProps extends PanelProps {
  defaultWidth: string;
  defaultHeight: string;
  minWidth?: string;
  enable?: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
    topRight: boolean;
    bottomRight: boolean;
    bottomLeft: boolean;
    topLeft: boolean;
  };
}
export function ResizablePanel({
  title,
  children,
  toolbarButton,
  className,
  defaultWidth,
  defaultHeight,
  enable,
  minWidth
}: ResizablePanelProps) {
  return (
    <Resizable
      defaultSize={{
        width: defaultWidth,
        height: defaultHeight,
      }}
      minWidth={minWidth}
      enable={enable}
      minHeight={'100%'}
    >
      <Flex direction={"column"} className={cx(panelStyle, className)} h="100%" grow={1}>
        <PanelTitle title={title} toolbarButton={toolbarButton} />
        {children}
      </Flex>
    </Resizable>
  );
}
interface PanelTitleProps {
    title: string;
    titleSize?: ResponsiveValue<(string & {}) | "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "3xl" | "xs">;
    toolbarButton?: React.ReactNode;
    className?: string;
  }

function PanelTitle({
    title,
    titleSize,
    toolbarButton,
    className,
  }: PanelTitleProps) {
    return (<>
      <Flex
        className={className}
        align="center"
        alignSelf="stretch"
        justify={'space-between'}
        p={2}
        h='45px'
      >
        <Heading size={titleSize || 'md'}>{title}</Heading>
        {toolbarButton}
      </Flex>
      <Divider />
      </>
    );
  }