import Select from 'react-select';
import { Token } from '../api';

type TokenSelectorProps = {
    selectedToken: Token;
    onChange: (token: Token) => void;
    tokens: Token[];
    disabled: boolean;
  };  

const customStyles = {
  option: (provided: any, state: any) => {
    const imgSrc = state.data.imageSrc;
    return {
      ...provided,
      paddingLeft: 32,
      backgroundImage: `url(${imgSrc})`,
      backgroundSize: '24px',
      backgroundPosition: '4px center',
      backgroundRepeat: 'no-repeat'
    };
  },
  singleValue: (provided: any, state: any) => {
    const imgSrc = state.getValue()[0]?.imageSrc;
    return {
      ...provided,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 32,
      backgroundImage: `url(${imgSrc})`,
      backgroundSize: '24px',
      backgroundPosition: '4px center',
      backgroundRepeat: 'no-repeat',
      paddingTop: 6,
      paddingBottom: 6
    };
  },
  placeholder: (provided: any) => {
    return {
      ...provided,
      paddingLeft: 8,
      paddingTop: 6,
      paddingBottom: 6
    };
  }
};

const TokenSelector: React.FC<TokenSelectorProps> = ({
    selectedToken,
    onChange,
    tokens,
    disabled
  }) => {
  
    return (
      <div className="mt-2">
        <Select
          styles={customStyles}
          value={selectedToken}
          options={tokens}
          onChange={(value) => onChange(value as Token)}
          isDisabled={disabled}
        />
      </div>
    );
  };
  

export default TokenSelector;
