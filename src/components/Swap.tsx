import { useState } from 'react';
import Select from 'react-select';

type Token = {
  label: string;
  value: string;
  imageSrc: string;
};

const tokens: Token[] = [
  { label: 'Token A', value: 'tokenA', imageSrc: '/logo.jpg' },
  { label: 'Token B', value: 'tokenB', imageSrc: '/logo.jpg' },
  // Add more tokens as required
];

const customStyles = {
  option: (provided: any, state: any) => {
    const imgSrc = state.getValue()[0].imageSrc;
    return { ...provided, paddingLeft: 40, backgroundImage: `url(${imgSrc})`, backgroundSize: '20px', backgroundPosition: '10px center', backgroundRepeat: 'no-repeat' };
  },
  singleValue: (provided: any, state: any) => {
    const imgSrc = state.getValue()[0].imageSrc;
    return { ...provided, paddingLeft: 40, backgroundImage: `url(${imgSrc})`, backgroundSize: '20px', backgroundPosition: '10px center', backgroundRepeat: 'no-repeat' };
  },
};

const Swap: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isBuySelected, setIsBuySelected] = useState(true);

  const handleGenerateOffer = () => {
    console.log('Selected token:', selectedToken);
    console.log('Action:', isBuySelected ? 'Buy' : 'Sell');
  };

  return (
    <div className="w-fill m-4">
      <div className="my-4">
        <div className="flex items-center justify-center">
          <button
            onClick={() => setIsBuySelected(true)}
            className={`${
              isBuySelected
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-white border-gray-300 text-black'
            } px-4 py-2 rounded-l-md focus:outline-none w-full border`}
          >
            Buy
          </button>
          <button
            onClick={() => setIsBuySelected(false)}
            className={`${
              isBuySelected
                ? 'bg-white border-gray-300 text-black'
                : 'bg-red-500 border-red-500 text-white'
            } px-4 py-2 rounded-r-md focus:outline-none w-full border`}
          >
            Sell
          </button>
        </div>
      </div>
      <div className="mb-4">
        <Select
          styles={customStyles}
          value={selectedToken}
          options={tokens}
          onChange={(value) => setSelectedToken(value as Token)}
        />
      </div>
      <button
        onClick={handleGenerateOffer}
        className={`${
            isBuySelected
              ? 'bg-green-500'
              : 'bg-red-500'
          } text-white px-4 py-2 rounded-md w-full mt-4`}
      >
        GENERATE OFFER
      </button>
    </div>
  );
};

export default Swap;
