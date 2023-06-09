type GenerateOfferButtonProps = {
  disabled: boolean;
  isBuySelected: boolean;
  onPressed: () => void;
  text?: string;
};

const GenerateOfferButton: React.FC<GenerateOfferButtonProps> = ({ disabled, onPressed, isBuySelected, text = 'Swap'}) => {
  return (
    <button
      onClick={onPressed}
      className={`${disabled ? 'bg-brandDark/10 text-brandDark/20 dark:text-brandLight/30 cursor-not-allowed' : (isBuySelected ? 'bg-green-800 hover:opacity-95' : 'bg-red-700 hover:opacity-95')} text-brandLight p-4 rounded-xl w-full mt-8 font-medium`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default GenerateOfferButton;
