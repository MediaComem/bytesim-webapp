interface AccordionChevronSVGProps {
  className?: string;
  color?: string;
}

export const AccordionChevronSVG = ({
  color,
  className,
}: AccordionChevronSVGProps) => (
  <svg
    width={12}
    height={12}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="m1 11 5-5-5-5" stroke={color} />
  </svg>
);
