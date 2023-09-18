import { useState, useEffect, type ChangeEvent, useRef } from "react";
import { setDevFee } from "@/redux/devFeeSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAppDispatch } from "@/hooks";

function DevFeeSelector() {

  const dispatch = useAppDispatch();
  const devFee = useSelector((state: RootState) => state.devFee.devFee);

  const inputRef = useRef<HTMLInputElement>(null);
  
  // Keep track of which option the user has selected
  const [selectedFee, setSelectedFee] = useState<0.3 | 0.7 | "Custom">();
  
  // Value that the input has (stored as a string)
  const [inputValue, setInputValue] = useState<string>("");
  
  // Clear input value if it's not the selected option
  useEffect(() => {
    if (selectedFee !== "Custom" && inputRef.current) {
      setInputValue("");
      inputRef.current.blur();
    }
  }, [selectedFee])
  
  // On page load, set the selected value based on the devFee stored in Redux
  useEffect(() => {
    if (!selectedFee && typeof devFee === "number") {
      const percentValue = parseFloat((Number(devFee*100)).toFixed(4));;
      switch (percentValue) {
        case 0.3:
          setSelectedFee(0.3);
          break;
        case 0.7:
          setSelectedFee(0.7);
          break;
        default:
          setSelectedFee("Custom");
          setInputValue(percentValue.toString());
          break;
      }
    }
  }, [devFee]); // Only need this to fire when devFee is available

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Check if input is a valid number between 0 and 100 with maximum 2 decimal places
    if (inputValue === '' || (/^\d{0,3}(\.\d{0,2})?$/.test(inputValue) && parseFloat(inputValue) <= 100)) {
      setInputValue(inputValue); // Update display input value
      const devFeeDecimal = parseFloat((Number(inputValue)/100).toFixed(4));
      dispatch(setDevFee(devFeeDecimal))
    }
  };

  const backgroundGradient = "bg-gradient-to-br from-[#7fa9b8] to-brandDark dark:from-brandDark dark:to-[#152f38]"

  return (
    <div
      className={`hover:border-brandDark/10 border-2 border-transparent flex gap-2 items-center h-[76px] bg-brandDark/10 rounded-xl p-2 text-center font-medium`}
    >
      {/* 0.3% Option */}
      <p
        onClick={() => {
          setSelectedFee(0.3);
          dispatch(setDevFee(0.003));
        }}
        className={`flex items-center justify-center cursor-pointer flex-1 font-medium rounded-xl 
          ${
            selectedFee === 0.3
              ? `text-brandLight bg-brandDark ${backgroundGradient}`
              : "hover:opacity-60 text-brandDark dark:text-brandLight/50"
          } 
          h-full px-4`}
      >
        0.3%
      </p>

      {/* 0.7% Option */}
      <p
        onClick={() => {
          setSelectedFee(0.7);
          dispatch(setDevFee(0.007));
        }}
        className={`flex items-center justify-center cursor-pointer flex-1 font-medium rounded-xl ${
          selectedFee === 0.7
            ? `text-brandLight bg-brandDark ${backgroundGradient}`
            : "hover:opacity-60 text-brandDark dark:text-brandLight/50"
        } h-full px-4`}
      >
        0.7%
      </p>

      {/* Custom Option */}
      <div
        onClick={() => setSelectedFee("Custom")}
        className={`flex items-center justify-center cursor-pointer flex-1 font-medium rounded-xl ${
          selectedFee === "Custom"
            ? `text-brandLight bg-brandDark ${backgroundGradient} `
            : "hover:opacity-60 text-brandDark dark:text-brandLight/50"
        } h-full px-4`}
      >
        <input
          type="text"
          ref={inputRef}
          className={`w-full h-full bg-transparent text-center focus:outline-none ${
            selectedFee === "Custom"
              ? "placeholder-brandLight"
              : "placeholder-brandDark dark:placeholder-brandLight/50"
          }`}
          placeholder="Custom"
          value={inputValue}
          onChange={handleChange}
          autoFocus={false}
        />
        {inputValue && <span className="font-medium pt-[2px]">%</span>}
      </div>
    </div>
  );
}

export default DevFeeSelector;