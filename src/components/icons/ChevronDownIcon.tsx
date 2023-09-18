type ChevronDownIconProps = {
  className?: string;
  title?: string;
}

function ChevronDownIcon({ className, title }: ChevronDownIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
      {title && <title>{title}</title>}
    </svg>
  );
}

export default ChevronDownIcon;