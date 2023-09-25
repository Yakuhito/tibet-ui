type MenuIconProps = {
  className?: string;
  title?: string;
  onClick?: () => void;
}

function MenuIcon({ className, title, onClick=() => {} }: MenuIconProps) {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 512 512"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke-width="32"
        d="M112 304h288M112 208h288"
      />
    </svg>
  );
}

export default MenuIcon;