// Used as buy/sell toggle buttons etc.

type BooleanSwitchProps = {
  isSelected: boolean;
  onChange: (isSelected: boolean) => void;
  trueLabel: string;
  falseLabel: string;
};

const BooleanSwitch: React.FC<BooleanSwitchProps> = ({ onChange, isSelected, trueLabel, falseLabel }) => {
  return (
      <div className="flex gap-1 items-center justify-center bg-brandDark/10 p-1 rounded-xl font-medium mb-4">

        <button
          onClick={() => onChange(true)}
          className={`${isSelected ? 'bg-green-800 text-brandLight' : 'text-black/50 dark:text-brandLight/50 hover:opacity-80'} px-4 py-2 rounded-lg focus:outline-none w-full transition duration-100`}
        >
          {trueLabel}
        </button>

        <button
          onClick={() => onChange(false)}
          className={`${isSelected ? 'text-black/50 dark:text-brandLight/50 hover:opacity-80' : 'bg-red-700 text-brandLight'} px-4 py-2 rounded-lg focus:outline-none w-full transition duration-100`}
        >
          {falseLabel}
        </button>
        
      </div>
  );
};

export default BooleanSwitch;
