import { useEffect, useState } from 'react';
import { GenerateOfferData } from './TabContainer';
import RingLoader from "react-spinners/RingLoader";
import { OfferResponse, Pair, Quote, Token, createOfferForPair, getInputPrice, getLiquidityQuote, getOutputPrice, getPairByLauncherId, getQuoteForPair } from '@/api';

type GenerateOfferProps = {
  data: GenerateOfferData;
};

const GenerateOffer: React.FC<GenerateOfferProps> = ({ data }) => {
    const [step, setStep] = useState<number>(0);
    /*
        steps:
            - 0: loading (check data)
            - 1: verified; ask user to confirm
            - 2: summary & paste
            - 3: send to server & see response
        errors:
            - -1 - amounts don't match
    */
    const [pairAndQuote, setPairAndQuote] = useState<[Pair, Quote] | null>(null);
    const [offer, setOffer] = useState<string>('');
    const [offerResponse, setOfferResponse] = useState<OfferResponse | null>(null);

    useEffect(() => {
        async function namelessFunction() {
            if(step === 0 && pairAndQuote === null) {
                const pair = await getPairByLauncherId(data.pairId);
                const quote = await getQuoteForPair(
                    data.pairId,
                    data.ask[0][2],
                    undefined,
                    data.ask[0][1],
                    true
                );
                setPairAndQuote([pair, quote]);
            } else if(step === 0) { // && pairAndQuote !== null
                const numAssets = data.ask.length + data.receive.length;
                if(numAssets === 2) {
                    const token0IsXCH = data.ask[0][1];
                    const token0Amount = data.ask[0][2];
                    const token1Amount = data.receive[0][2];

                    var xchAmount: number = token0Amount,
                        tokenAmount: number = token1Amount;
                    if(!token0IsXCH) {
                        xchAmount = token1Amount;
                        tokenAmount = token0Amount;
                    }
                    
                    const pair = pairAndQuote![0];
                    var expectedTokenAmount = getInputPrice(xchAmount, pair.xch_reserve, pair.token_reserve);
                    if(!token0IsXCH) {
                        expectedTokenAmount = getOutputPrice(xchAmount, pair.token_reserve, pair.xch_reserve);
                    }

                    if(expectedTokenAmount !== tokenAmount) {
                        setStep(-1);
                    } else {
                        setStep(2);
                    }
                } else {
                    const takeAssetsFromAsk = data.ask.length === 2;

                    var token0Amount: number,
                        token0IsXCH: boolean,
                        token1Amount: number,
                        liquidityAmount: number;

                    if(takeAssetsFromAsk) {
                        token0Amount = data.ask[0][2];
                        token0IsXCH = data.ask[0][1];
                        token1Amount = data.ask[1][2];
                        liquidityAmount = data.receive[0][2];
                    } else {
                        token0Amount = data.receive[0][2];
                        token0IsXCH = data.receive[0][1];
                        token1Amount = data.receive[1][2];
                        liquidityAmount = data.ask[0][2];
                    }

                    var xchAmount: number = token0Amount,
                        tokenAmount: number = token1Amount;
                    if(!token0IsXCH) {
                        xchAmount = token1Amount;
                        tokenAmount = token0Amount;
                    }
                    
                    const pair = pairAndQuote![0];
                    const expectedXCHAmount = getLiquidityQuote(liquidityAmount, pair.liquidity, pair.xch_reserve, false);
                    const expectedTokenAmount = getLiquidityQuote(liquidityAmount, pair.liquidity, pair.token_reserve, false);
                    if(expectedXCHAmount !== xchAmount || expectedTokenAmount !== tokenAmount) {
                        setStep(-1);
                    } else {
                        setStep(2);
                    }
                }
            } else if(step === 3 && offerResponse === null) {
                const offerResponse = await createOfferForPair(
                    pairAndQuote![0].launcher_id,
                    offer,
                    data.action,
                    undefined
                );
                setOfferResponse(offerResponse);
            }
        }

        if([0, 3].includes(step)) {
            namelessFunction();
        }
    }, [data, step, pairAndQuote, offer, offerResponse]);

    const listAssets = (a: [Token, boolean, number][]) => {
        return <ul className="list-disc">
            {a.map(e => <li className="ml-6" key={e[0].asset_id}>
                {e[2] / Math.pow(10, e[1] ? 12 : 3)} {e[0].name}
            </li>)}
        </ul>;
    }

    const renderContent = (step: number) => {
        if(step === 0) {
            return (
                <div className="mt-16 mb-16 flex justify-center items-center flex-col">
                    <RingLoader size={64} color={"#123abc"} />
                    <div className='mt-4'>Verifying trade data...</div>
                </div>
            )
        }
        if(step === 2) {
            return <div className="text-left w-full">
                <u>Order Summary</u>
                <br />
                <br />
                <p>Offering:</p>
                {listAssets(data.receive)}
                <p>Requesting:</p>
                {listAssets(data.ask)}
                <p>Minimum fee: {pairAndQuote![1].fee / Math.pow(10, 12)} XCH</p>
                <br />
                <p>Please generate the offer, paste it below, and click the button to proceed.</p>
                <input type="text"
                    value={offer}
                    className='w-full py-2 px-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                    onChange={e => setOffer(e.target.value)}
                    placeholder='offer1...'
                />
                <button
                    onClick={() => setStep(3)}
                    className={`${
                        offer.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500'
                    } text-white px-4 py-2 rounded-md w-full mt-4`}
                    disabled={offer.length === 0}
                >
                Submit Offer
                </button>
            </div>;
        }
        if(step === -1) {
            return (
                <div className="mt-16 mb-16 flex justify-center items-center flex-col">
                    <div>Oops! Amounts don{"'"}t match anymore.</div>
                    <div>Please go back and try again.</div>
                </div>
            )
        }
        if(step == 3) {
            if(offerResponse === null) {
                return <div className="mt-16 mb-16 flex justify-center items-center flex-col">
                    <RingLoader size={64} color={"#123abc"} />
                    <div className='mt-4'>Sending offer...</div>
                </div>;
            }

            return <div className="mt-16 mb-16 flex justify-center items-center flex-col">
                <div>{offerResponse!.success ? 'Offer submission successful!' : 'Error ocurred while submitting offer :('}</div>
                <div>{offerResponse!.message}</div>
            </div>
        }
        return (
            <div className="mt-16 mb-16 flex justify-center items-center flex-col">
                <div>Something went wrong - please refresh this page</div>
            </div>
        );
    }

    return (
        <div className="p-4 w-full h-full flex justify-center items-center">
            { renderContent(step) }
        </div>
  );
};

export default GenerateOffer;
