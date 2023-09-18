type ChevronUpDownProps = {
  className?: string;
}

function ChevronUpDownIcon({ className }: ChevronUpDownProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 512 512"
    >
      <path
        d="M136 208l120-104 120 104M136 304l120 104 120-104"
        stroke="currentColor"
        fill="none"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ChevronUpDownIcon;