import * as React from "react";
import { Box, Flex, ThemingProps } from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import { ReactComponent as SettingsIcon } from "../../assets/GeneralSettings_Icon.svg";
import { ReactComponent as ImportedGroupIcon } from "../../assets/ImportedGroup_Icon.svg";
import { ReactComponent as DrawnZoneIcon } from "../../assets/DrawnZones_icon.svg";

const iconStyle = css({
  margin: "3px",
});

interface AccordionCustomTitleProps extends ThemingProps<"Text"> {
  label: string | React.ReactNode;
  icon?: string;
  className?: string;
  iconClassName?: string;
  size?: string;
}
export default function AccordionCustomTitle({
  icon,
  label,
  className,
  iconClassName,
  size,
}: AccordionCustomTitleProps) {
  return (
    <Flex px={2} align="center" className={className}>
      {icon && <Icon icon={icon} className={iconClassName} />}
      <Box
        fontSize={!size ? "16px" : size}
        fontWeight={"bold"}
        px={1}
        whiteSpace="nowrap"
      >
        {label}
      </Box>
    </Flex>
  );
}

interface IconProps {
  icon: string;
  className?: string;
}
function Icon({ icon, className }: IconProps) {
  switch (icon) {
    case "settings":
      return <SettingsIcon className={cx(iconStyle, className)} />;
    case "importedGroup":
      return <ImportedGroupIcon className={cx(iconStyle, className)} />;
    case "drawnZone":
      return <DrawnZoneIcon className={cx(iconStyle, className)} />;
    default:
      return <>?</>;
  }
}
