import { useState, useRef, useEffect } from 'react';

interface CopyButtonProps {
    copyText: string;
    height?: string;
    children: string;
}

const CopyButton = ({ copyText, height, children }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Ensures when button text changes to reflect copied text, the size doesn't change
  useEffect(() => {
    if (buttonRef.current) {
        const buttonWidth = buttonRef.current.offsetWidth;
        buttonRef.current.style.width = `${buttonWidth}px`;
    }
  },[])

  const handleCopy = () => {
    if (isCopied) return;
    
    navigator.clipboard
    .writeText(copyText)
    .then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    })
    .catch((error) => {
      console.error('Copy failed:', error);
      alert(`Failed to copy: ${copyText}`)
    });
  };

  return (
    <button style={{ height: height }} onClick={handleCopy} ref={buttonRef} className={`${isCopied ? 'cursor-default bg-green-700/20 text-green-700' : 'cursor-pointer text-brandDark dark:text-brandLight hover:opacity-80'} bg-brandDark/10 text-center font-medium py-1 flex items-center justify-center gap-2 px-4 whitespace-nowrap rounded-lg`}>
      {!isCopied && <svg className="w-3.5 stroke-[54px] fill-brandDark aspect-square" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect x="128" y="128" width="336" height="336" rx="57" ry="57" fill="none" stroke="currentColor" strokeLinejoin="round" /><path d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      {isCopied ? 'Copied' : children}
    </button>
  );
};

export default CopyButton;
