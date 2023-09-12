type PlusIconProps = {
  className?: string;
}

function PlusIcon({ className }: PlusIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      className={className}
      viewBox="0 0 512 512"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M256 112v288M400 256H112"
      />
    </svg>
  );
}

export default PlusIcon;