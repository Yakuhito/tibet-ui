type GenerateOfferButtonProps = {
  disabled: boolean;
  isBuySelected: boolean;
  onPressed: () => void;
  text?: string;
};

const GenerateOfferButton: React.FC<GenerateOfferButtonProps> = ({ disabled, onPressed, isBuySelected, text = 'Swap'}) => {
  if (disabled) return <></>
  return (
    <button
      onClick={onPressed}
      className={`${disabled ? "bg-brandDark/10 text-brandDark/20 dark:text-brandLight/30 cursor-not-allowed" : "hover:opacity-90"} 
        p-4 rounded-xl w-full mt-8 h-[72px] font-bold bg-gradient-to-br from-[#7fa9b8]/90 to-brandDark/90 dark:from-brandDark dark:to-[#152f38] text-brandLight text-2xl animate-fadeIn`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default GenerateOfferButton;
