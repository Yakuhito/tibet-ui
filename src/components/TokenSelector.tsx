import Select from 'react-select';
import { Token } from '../api';

type TokenSelectorProps = {
    selectedToken: Token | null;
    onChange: (token: Token) => void;
    tokens: Token[];
    disabled: boolean;
  };  

const customStyles = {
  option: (provided: any, state: any) => {
    const imgSrc = state.data.imageSrc;
    return {
      ...provided,
      paddingLeft: 48,
      backgroundImage: `url(${imgSrc})`,
      backgroundSize: '24px',
      backgroundPosition: '20px center',
      backgroundRepeat: 'no-repeat',
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
      paddingBottom: 6,
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
  
    const tkToOption = (token: Token) => ({
      value: token,
      label: `${token.name} (${token.short_name}) ${token.verified ? '✅' : '❗'}`,
      imageSrc: token.image_url,
      id: token.pair_id
    });

    return (
      <div className="mt-2">
        <Select
          styles={customStyles}
          value={selectedToken ? tkToOption(selectedToken) : null}
          options={tokens.map(tkToOption)}
          onChange={(value) => onChange(value!.value)}
          isDisabled={disabled}
        />
      </div>
    );
  };
  

export default TokenSelector;
