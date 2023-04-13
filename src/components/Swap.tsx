import { useState } from 'react';
import Select from 'react-select';
import { Switch } from '@headlessui/react';

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
  option: (provided: any, state: any) => ({
    ...provided,
    paddingLeft: 40,
  }),
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
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <button className="bg-gray-200 px-4 py-2 font-bold">Swap</button>
        <button className="bg-gray-100 px-4 py-2 font-bold">Liquidity</button>
      </div>
      <div>
        <Select
          styles={customStyles}
          value={selectedToken}
          options={tokens}
          onChange={(value) => setSelectedToken(value as Token)}
        />
      </div>
      <div className="my-4">
        <Switch.Group as="div" className="flex items-center justify-center">
          <Switch.Label className="mr-3">Buy</Switch.Label>
          <Switch
            as="button"
            checked={isBuySelected}
            onChange={setIsBuySelected}
            className={`${
              isBuySelected ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none`}
          >
            <span
              className={`${
                isBuySelected ? 'translate-x-6' : 'translate-x-1'
              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
            />
          </Switch>
          <Switch.Label className="ml-3">Sell</Switch.Label>
        </Switch.Group>
      </div>
      <button
        onClick={handleGenerateOffer}
        className="bg-green-500 text-white px-4 py-2 rounded-md"
      >
        GENERATE OFFER
      </button>
    </div>
  );
};

export default Swap;
