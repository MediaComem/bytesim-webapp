import * as React from "react";
import { Flex, Text, ThemingProps } from "@chakra-ui/react";
import { css, cx } from "@emotion/css";
import { ReactComponent as SettingsIcon } from "../../assets/GeneralSettings_Icon.svg";
import { ReactComponent as ImportedGroupIcon } from "../../assets/ImportedGroup_Icon.svg";
import { ReactComponent as DrawnZoneIcon } from "../../assets/DrawnZones_icon.svg";

const iconStyle = css({
  margin: '3px',
})

interface AccordionCustomTitleProps extends ThemingProps<'Text'>{
  label: string | React.ReactNode;
  icon?: 'settings' | 'importedGroup' | 'drawnZone';
  className?: string;
  iconClassName?: string;
}
export default function AccordionCustomTitle({
  icon,
  label,
  className,
  iconClassName,
  size
}: AccordionCustomTitleProps) {
  return (
    <Flex align='center' className={className}>
      {icon && <Icon icon={icon} className={iconClassName} /> }
      <Text fontSize={size || 'md'} whiteSpace="nowrap">{label}</Text>
    </Flex>
  );
}

interface IconProps {
  icon: string;
  className?: string;
}
function Icon({ icon, className }: IconProps) {
  switch (icon) {
    case 'settings':
      return <SettingsIcon className={cx(iconStyle, className)}/>
    case 'importedGroup':
      return <ImportedGroupIcon className={cx(iconStyle, className)}/>
    case 'drawnZone':
      return <DrawnZoneIcon className={cx(iconStyle, className)}/>
    default:
      return <>?</>
  }
}
