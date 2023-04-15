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
        disabled ? 'bg-gray-300 cursor-not-allowed' : (isBuySelected ? 'bg-green-500' : 'bg-red-500')
      } text-white px-4 py-2 rounded-md w-full mt-8`}
      disabled={disabled}
    >
      GENERATE OFFER
    </button>
  );
};

export default GenerateOfferButton;
