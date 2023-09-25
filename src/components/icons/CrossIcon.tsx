type CrossIconProps = {
  className?: string;
  title?: string;
  onClick?: () => void;
}

function CrossIcon({ className="fill-[#b91c1c]", title, onClick=() => {} }: CrossIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="14px"
      height="14px"
      className={className}
      onClick={onClick}
    >
      {title && <title>{title}</title>}
      <path
        d="M21.5 4.5H26.501V43.5H21.5z"
        transform="rotate(45.001 24 24)"
      />
      <path
        d="M21.5 4.5H26.5V43.501H21.5z"
        transform="rotate(135.008 24 24)"
      />
    </svg>
  );
}

export default CrossIcon;