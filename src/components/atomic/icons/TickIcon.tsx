type TickProps = {
  className?: string;
  title?: string;
}

function TickIcon({ className="fill-[#166534]", title }: TickProps) {
  return ( 
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="14px"
      height="14px"
      className={className}
    >
      {title && <title>{title}</title>}
      <path
        d="M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z"
      />
    </svg>
   );
}

export default TickIcon;