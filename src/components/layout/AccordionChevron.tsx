import { css, cx } from "@emotion/css";
import { AccordionChevronSVG } from "./AccordionChevronSVG";
interface AccordionChevronProps {
  isExpanded: boolean;
  setOpen?: () => void;
  className?: string;
  color?: string;
}
export default function AccordionChevron({
  isExpanded,
  setOpen,
  className,
  color = "#000",
}: AccordionChevronProps) {
  return (
    <div
      onClick={() => {
        if (setOpen) {
          setOpen();
        }
      }}
    >
      <AccordionChevronSVG
        color={color}
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
    </div>
  );
}
