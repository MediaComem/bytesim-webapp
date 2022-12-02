import { css, cx } from "@emotion/css";
import { AccordionChevronSVG } from "./AccordionChevronSVG";
interface AccordionChevronProps {
  isExpanded: boolean;
  isWarning?: true;
  setOpen?: () => void;
  className?: string;
  color?: string;
}
export default function AccordionChevron({
  isExpanded,
  isWarning,
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
          css({ stroke: isWarning ? "#C53030" : "black" }),
          className
        )}
      />
    </div>
  );
}
