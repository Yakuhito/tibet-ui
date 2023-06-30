import { useEffect } from 'react';


interface SuggestionsProps {
    userInput: string;
    setUserInput: (value: string) => void;
    isInputFocused: boolean;
    predictedText: string;
    setPredictedText: React.Dispatch<React.SetStateAction<string>>;
    tokens: string[] | null;
}

function Suggestions({ userInput, setUserInput, isInputFocused, predictedText, setPredictedText, tokens }: SuggestionsProps) {

    const firstWordOptions = ["Buy", "Sell"]
    const secondWordOptions = tokens || [""]; //["DBX", "XCH", "BBT"] // Either number or token
    
    useEffect(() => {
        console.log(tokens, '👿')

        const generatePredictiveText = () => {
            if (!secondWordOptions) return
            // Detect if anything earlier in the sentence has been modified. If it has, re-do predictive text.
            const userInputMinusOneWord = userInput.split(' ').pop();
            const predictionMinusOneWord = predictedText.split(' ').pop();
            if (userInputMinusOneWord !== predictionMinusOneWord) {
                setPredictedText("")
            }


            const words = userInput.split(' ');

            // If empty input, remove predictive text
            if (!words[0]) return setPredictedText("")
            
            // Predict first word
            if (words.length === 1) {
                const predictedFirstWord = firstWordOptions.filter((option) =>
                  option.toLowerCase().startsWith(words[0].toLowerCase())
                );
                const useUserLetterCasing = predictedFirstWord.length ? words[0] + predictedFirstWord[0].slice(words[0].length) : "";
                setPredictedText(useUserLetterCasing);

            // Predict second word (can either be a number or a token value)
            } else if (words.length === 2) {
                if (!isNaN(Number(words[1])) || !words[1]) {
                    const useUserLetterCasing = `${words[0]} ${words[1]}`;
                    setPredictedText(useUserLetterCasing);
                    return
                }
                const predictedSecondWord = secondWordOptions.filter((option) =>
                  option.toLowerCase().startsWith(words[1].toLowerCase())
                );
                const useUserLetterCasing = predictedSecondWord.length ? `${words[0]} ${words[1]}${predictedSecondWord[0].slice(words[1].length)} ${words[0].toLowerCase() === "buy" ? "with" : "for"}` : "";
                setPredictedText(useUserLetterCasing);

            // Predict third word
            } else if (words.length === 3) {
                const isSecondWordToken = secondWordOptions.some(item => item === words[1].toUpperCase())
                // If the second word is a token (e.g. Buy DBX instead of Buy 1), move on
                if (isSecondWordToken) return;
                if (!words[2]) {
                    const useUserLetterCasing = `${words[0]} ${words[1]} ${words[2]}`;
                    setPredictedText(useUserLetterCasing);
                    return
                }

                const predictedThirdWord = secondWordOptions.filter((option) =>
                  option.toLowerCase().startsWith(words[2].toLowerCase())
                );
                const useUserLetterCasing = predictedThirdWord.length ? `${words[0]} ${words[1]} ${words[2]}${predictedThirdWord[0].slice(words[2].length)} ${words[0].toLowerCase() === "buy" ? "with" : "for"} ${words[2].toLowerCase() === "XCH" ? "" : "XCH"}` : "";
                setPredictedText(useUserLetterCasing);

            // Predict 5th word
            } else if (words.length === 5) {
                if (!words[4]) {
                    const useUserLetterCasing = `${words[0]} ${words[1]} ${words[2]} ${words[3]} ${words[4]} ${words[1].toLowerCase() === "XCH" ? "" : "XCH"}`;
                    setPredictedText(useUserLetterCasing);
                    return
                }

                const predictedFithWord = secondWordOptions.filter((option) =>
                  option.toLowerCase().startsWith(words[4].toLowerCase())
                );
                const useUserLetterCasing = predictedFithWord.length ? `${words[0]} ${words[1]} ${words[2]} ${words[3]} ${words[4]}${predictedFithWord[0].slice(words[4].length)}` : "";
                setPredictedText(useUserLetterCasing);
            }
        }
        generatePredictiveText()


    }, [userInput, firstWordOptions, secondWordOptions, setPredictedText, predictedText])
    

    const selectSuggestion = (event: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>, suggestionText: string) => {
        if ((event as React.KeyboardEvent<HTMLDivElement>).key === 'Enter' || event.type === 'click') {
            event.preventDefault();
            setUserInput(suggestionText);
            setPredictedText(suggestionText);
        }
    }

    if (!secondWordOptions) return <></>

    return ( 
        <div className={`text-brandDark/60 dark:text-brandLight/80 transition-all overflow-y-auto ease-in-out ${isInputFocused ? "max-h-48" : "max-h-0"}`}>

            {secondWordOptions.map((token, index) => {
                if (!predictedText) return <></>
                const regex = new RegExp(`\\b(${secondWordOptions.join('|')})\\b`, 'i');
                
                const updatedString = predictedText.replace(regex, (match) => {
                    return match.toLowerCase() === secondWordOptions[0].toLowerCase() ? match : token; // Replace with unique token ticker
                });
                            
                return (
                <div key={index} onClick={(e) => selectSuggestion(e, updatedString)} onKeyDown={(e) => selectSuggestion(e, updatedString)} className="px-14 py-4 cursor-pointer hover:bg-brandDark/5 focus:bg-brandDark/5 transition font-medium focus:outline-none" tabIndex={0}>
                    <p className="px-0.5">{updatedString}</p>
                </div>
                )
            })}

            {/* <div className="px-14 py-4 cursor-pointer hover:bg-brandDark/5 focus:bg-brandDark/5 transition font-medium focus:outline-none" tabIndex={0}>
                <p className="px-0.5">Buy 10 BBT with XCH</p>
            </div>
            <div className="px-14 py-4 cursor-pointer hover:bg-brandDark/5 focus:bg-brandDark/5 transition font-medium focus:outline-none" tabIndex={0}>
                <p className="px-0.5">Sell 10 BBT for XCH</p>
            </div> */}
        </div>
     );
}

export default Suggestions;