import CrossIcon from '../icons/CrossIcon';
import Tick from '../icons/TickIcon';
import Select from 'react-select';
import { Token } from '../../api';
import Image from 'next/image';

type TokenSelectorProps = {
    selectedToken: Token | null;
    onChange: (token: Token) => void;
    tokens: Token[];
    disabled: boolean;
  };  

const customStyles = {
  option: (provided: any, state: any) => {
    return {
      ...provided,
      cursor: 'pointer',
      color: undefined,
      fontWeight: 500,
      backgroundColor: undefined,
      paddingTop: '1rem',
      paddingBottom: '1rem',
      paddingLeft: '.5rem',
      borderRadius: '0.5rem',
      ':not(:last-child)': {
        marginBottom: '2px',
      },
      ':active': {
        backgroundColor: undefined,
      }
    };
  },
  singleValue: (provided: any, state: any) => {
    return {
      ...provided,
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500,
      paddingTop: 10,
      paddingBottom: 10,
      marginLeft: '-1rem',
      color: undefined,
    };
  },
  placeholder: (provided: any) => {
    return {
      ...provided,
      paddingTop: 10,
      paddingBottom: 10,
      fontWeight: 500,
      color: undefined,
    };
  },
  control: (provided: any, state: any) => ({
    ...provided,
    border: 0,
    borderRadius: '0.75rem',
    backgroundColor: '#526e781a',
    ':hover': {
      opacity: 0.8,
    },
    paddingLeft: '1rem',
    boxShadow: state.isFocused ? '0 0 0 3px rgb(82 110 120 / 0.4)' : provided.boxShadow,
    transition: 0,
    cursor: 'pointer',
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    color: state.isFocused ? '#526e78' : 'rgb(82 110 120 / 35%)',
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: undefined,
    borderRadius: '0.75rem',
    border: 0,
    paddingLeft: '4px',
    paddingRight: '4px',
    '@media (prefers-color-scheme: dark)': {
      '*::-webkit-scrollbar-thumb': {
        borderColor: '#1E2124',
      }
    },
  }),
};

// For tailwind dark theme compatibility
const customClassNames = {
  menu: (state: any) => "bg-slate-100 dark:bg-[#1E2124]",
  singleValue: (state: any) => "dark:text-brandLight",
  option: (state: any) => (`dark:text-brandLight ${state.isSelected ? 'bg-[#E0E7EC] dark:bg-zinc-900' : state.isFocused ? 'bg-[#E0E7EC] dark:bg-zinc-900' : 'transparent'}`),
  placeholder: (state: any) => "text-black dark:text-brandLight"
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
    selectedToken,
    onChange,
    tokens,
    disabled
  }) => {
  
    const tkToOption = (token: Token) => {
      const imgSrc = token.image_url;
      return {
        value: token,
        label: (
          <div className="flex items-center gap-2 pl-4">
            <Image className="rounded-full animate-fadeIn w-6 h-6" src={imgSrc} alt={`${token.short_name} logo`} width={24} height={24} priority />
            <p>{`${token.name} (${token.short_name})`}</p>
            {token.verified && <Tick title="Verified" />}
            {!token.verified && <CrossIcon title="Unverified" />}
          </div>
        ),
        imageSrc: imgSrc,
        id: token.pair_id,
      };
    };

    const customFilterOption = (option: any, rawInput: string): boolean => {
      const input = rawInput.toLowerCase();
    
      // Check the 'short_name' and 'name' properties of the token
      if (option.value && option.value.short_name && option.value.name) {
        const shortName = option.value.short_name.toLowerCase();
        const name = option.value.name.toLowerCase();
        return shortName.includes(input) || name.includes(input);
      }
    
      return false;
    };

    return (
      <div className="mt-2 token-selector">
        <Select
          styles={customStyles}
          classNames={customClassNames}
          value={selectedToken ? tkToOption(selectedToken) : null}
          options={tokens.map(tkToOption)}
          onChange={(value) => onChange(value!.value)}
          isDisabled={disabled}
          placeholder="Select a token..."
          filterOption={customFilterOption}
        />
      </div>
    );
  };
  

export default TokenSelector;