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
        isBuySelected ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500'
      } text-white px-4 py-2 rounded-md w-full mt-8`}
      disabled={disabled}
    >
      GENERATE OFFER
    </button>
  );
};

export default GenerateOfferButton;
