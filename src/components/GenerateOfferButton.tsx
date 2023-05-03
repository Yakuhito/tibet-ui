import React from 'react';

type GenerateOfferButtonProps = {
  disabled: boolean;
  isBuySelected: boolean;
  onPressed: () => void;
};

const GenerateOfferButton: React.FC<GenerateOfferButtonProps> = ({
  disabled,
  onPressed,
  isBuySelected,
}) => {
  return (
    <button
      onClick={onPressed}
      className={`${
        disabled ? 'bg-brandDark/10 text-brandDark/20 dark:text-brandLight/30 cursor-not-allowed' : (isBuySelected ? 'bg-green-800' : 'bg-red-700')
      } text-brandLight px-4 py-2 rounded-lg w-full mt-8 font-medium`}
      disabled={disabled}
    >
      Generate Offer
    </button>
  );
};

export default GenerateOfferButton;
