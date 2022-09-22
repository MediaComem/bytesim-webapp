import { css, cx } from "@emotion/css";
import { ReactComponent as OpenIcon } from "../../assets/Fleche_Fermee.svg";

interface AccordionChevronProps {
  isExpanded: boolean;
}
export default function AccordionChevron({
  isExpanded,
}: AccordionChevronProps) {
  return (
    <OpenIcon
      className={cx(
        {
          [css({ transform: "rotate(90deg)", transformOrigin: "center" })]:
            isExpanded,
        },
        css({ margin: "2px" })
      )}
    />
  );
}
