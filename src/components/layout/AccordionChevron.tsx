import * as React from "react";
import { css, cx } from "@emotion/css";
import { ReactComponent as OpenIcon } from "../../assets/Fleche_Fermee.svg";
interface AccordionChevronProps {
  isExpanded: boolean;
  setOpen?: () => void;
  className?: string;
}
export default function AccordionChevron({
  isExpanded,
  setOpen,
  className,
}: AccordionChevronProps) {
  return (
    <OpenIcon
      onClick={() => {
        if (setOpen) {
          setOpen();
        }
      }}
      className={cx(
        {
          [css({ transform: "rotate(90deg)", transformOrigin: "center" })]:
            isExpanded,
        },
        css({
          margin: "2px",
          "&:hover": {
            cursor: "pointer",
          },
        }),
        className
      )}
    />
  );
}
