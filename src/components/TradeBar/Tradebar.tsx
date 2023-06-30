import { useState, ChangeEvent, useEffect } from 'react';
import { getAllTokens } from '../../api';
import Suggestions from './Suggestions';

interface TradeBarProps {
    isInputFocused: boolean;
}

function TradeBar({ isInputFocused }: TradeBarProps) {
    const [userInput, setUserInput] = useState("")
    const [predictedText, setPredictedText] = useState("")

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
      };


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Tab') {
        if (predictedText && predictedText !== userInput) {
            event.preventDefault();
            setUserInput(predictedText);
        } 
      }
    };

    const [tokens, setTokens] = useState<string[] | null>(null);
    useEffect(() => {
      async function fetchTokens() {
        const allTokens = await getAllTokens();
        const formattedTokenList = allTokens.map((token) => {
            return token.short_name
        })
        setTokens(formattedTokenList);

      }
      fetchTokens();
    }, []);

    return ( 
        <>
            {/* Tradebar */}
            <div className="flex items-center border-2 border-transparent relative min-h-[40px]">
                <svg className="ml-4 text-brandDark/40 dark:text-brandLight/40 absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="24" height="24"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                <input type="text" value={userInput} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Buy 10 BBT with XCH" className="z-10 placeholder-brandDark/40 focus:placeholder-opacity-100 dark:placeholder-brandLight/40 font-medium p-4 py-4 px-14 w-full focus:outline-none bg-transparent" />
                <p className="absolute font-medium py-4 px-14 text-brandDark/60 dark:text-brandLight/80">{predictedText}</p>
            </div>

            <Suggestions userInput={userInput} setUserInput={setUserInput} isInputFocused={isInputFocused} predictedText={predictedText} setPredictedText={setPredictedText} tokens={tokens} />
        </>
     );
}

export default TradeBar;