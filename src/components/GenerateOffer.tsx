import { ActionType, createOfferForPair, getInputPrice, getLiquidityQuote, getOutputPrice, getPairByLauncherId, getQuoteForPair } from '@/api';
import AddAssetButton from './walletIntegration/AddAssetButton';
import type { OfferResponse, Pair, Quote, Token } from '@/api';
import type { GenerateOfferData } from './TabContainer';
import { generateOffer } from '@/redux/walletSlice';
import BarLoader from 'react-spinners/BarLoader';
import CopyButton from './atomic/CopyButton';
import { RingLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import SuccessScreen from './SuccessScreen';
import { type RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import CrossIcon from './icons/CrossIcon';
import { useAppDispatch } from '@/hooks';
import Image from 'next/image';


type GenerateOfferProps = {
  data: GenerateOfferData;
  devFee: number;
  setGenerateOfferData: (value: GenerateOfferData) => void;
  activeTab: 'swap' | 'liquidity';
};

const GenerateOffer: React.FC<GenerateOfferProps> = ({ data, devFee, setGenerateOfferData, activeTab }) => {
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
    const [pair, setPair] = useState<Pair | null>(null);
    const [copyErrorMessageSuccess, setCopyErrorMessageSuccess] = useState(false);

    // Update pair rates every 4 seconds
    useEffect(() => {
        if (step !== 3) {
            const updateOrderData = setInterval(async () => {

                const updatePair = async () => {
                    console.log('Updating Pair')
                    const newPairData = await getPairByLauncherId(data.pairId);
                    setPair(newPairData)
                }
                updatePair()


                // Update order rates every 4 seconds
                const updateOfferDataSwap = () => {
                    if (pair) {
                        const newOfferData = {...data};
                        const isBuy = newOfferData.offer[0][0].short_name === process.env.NEXT_PUBLIC_XCH;
                        const { xch_reserve, token_reserve } = pair // Get latest reserve amounts

                        if (isBuy) {
                            const amount0 = newOfferData.offer[0][2]
                            const amount1 = getInputPrice(amount0, xch_reserve, token_reserve); // Get updated token quote
                            newOfferData.request[0][2] = amount1;
                            setGenerateOfferData(newOfferData);
                            console.log("Updating offer data");
                        } else {
                          const amount1 = newOfferData.offer[0][2];
                          const amount0 = getInputPrice(amount1, token_reserve, xch_reserve); // Get updated XCH quote
                          newOfferData.request[0][2] = amount0;
                          console.log("Updating offer data");
                          setGenerateOfferData(newOfferData);
                        }
                    }
                }
                if (activeTab === 'swap') updateOfferDataSwap()


                const updateOfferDataLiquidity = () => {
                    if (pair) {
                        const newOfferData = {...data};
                        const isAddLiquidity = newOfferData.action === "ADD_LIQUIDITY";
                        const { xch_reserve, token_reserve, liquidity } = pair; // Get latest reserve amounts
                        const pairLiquidity = liquidity;


                        if (isAddLiquidity) {
                          const tokenAmount = newOfferData.offer[1][2];
                          const liquidity = getLiquidityQuote(tokenAmount, token_reserve, pairLiquidity, false);
                          var xchAmount = getLiquidityQuote(tokenAmount, token_reserve, xch_reserve, false);
                          xchAmount += liquidity;
                        
                          newOfferData.offer[0][2] = xchAmount; // Update Amount0
                          newOfferData.request[0][2] = liquidity; // Update Amount2
                        
                          console.log("Updating offer data");
                          setGenerateOfferData(newOfferData);
                        } else {
                          const liquidityTokens = newOfferData.offer[0][2]
                          const tokenAmount = getLiquidityQuote(liquidityTokens, pairLiquidity, token_reserve, true);
                          var xchAmount = getLiquidityQuote(liquidityTokens, pairLiquidity, xch_reserve, true);
                          xchAmount += liquidityTokens;
                        
                          newOfferData.request[0][2] = xchAmount; // Update Amount0
                          newOfferData.request[1][2] = tokenAmount; // Update Amount1
                        
                          console.log("Updating offer data");
                          setGenerateOfferData(newOfferData);
                        }
                    }
                }
                if (activeTab === 'liquidity') updateOfferDataLiquidity()


                // Update fee
                const updateFee = async () => {
                    if (!pair) return;
                    console.log('Updating Fee')
                    const quote = await getQuoteForPair(
                        data.pairId,
                        data.offer[0][2],
                        undefined,
                        data.offer[0][1],
                        true
                    );
                    setPairAndQuote([pair, quote]);
                }
                updateFee()

            }, 4000)
            return () => {if (step !== 3) clearInterval(updateOrderData)}
        }
    }, [data, pair, setGenerateOfferData, activeTab, step])

    
    
    useEffect(() => {
        async function namelessFunction() {
            if(step === 0 && pairAndQuote === null) {
                const pair = await getPairByLauncherId(data.pairId);
                const quote = await getQuoteForPair(
                    data.pairId,
                    data.offer[0][2],
                    undefined,
                    data.offer[0][1],
                    true
                );
                setPairAndQuote([pair, quote]);
            } else if(step === 0) {
                const numAssets = data.offer.length + data.request.length;
                if(numAssets === 2) {
                    const token0IsXCH = data.offer[0][1];
                    const token0Amount = data.offer[0][2];
                    const token1Amount = data.request[0][2];

                    var xchAmount: number = token0Amount,
                        tokenAmount: number = token1Amount;
                    if(!token0IsXCH) {
                        xchAmount = token1Amount;
                        tokenAmount = token0Amount;
                    }
                    
                    const pair = pairAndQuote![0];
                    if(token0IsXCH) {
                        const expectedTokenAmount = getInputPrice(xchAmount, pair.xch_reserve, pair.token_reserve);
                        if(expectedTokenAmount > tokenAmount) {
                            setStep(-1);
                        } else {
                            const expectedXCHAmount = getOutputPrice(tokenAmount, pair.xch_reserve, pair.token_reserve)
                            if(expectedXCHAmount < xchAmount) {
                                const newOfferData = {...data};
                                newOfferData.offer[0][2] = expectedXCHAmount;
                                console.log("Updating offer data");
                                setGenerateOfferData(newOfferData);
                            }
                            setStep(2);
                        }
                    }
                    
                    if(!token0IsXCH) {
                        const expectedXCHAmount = getInputPrice(tokenAmount, pair.token_reserve, pair.xch_reserve);
                        if(expectedXCHAmount < xchAmount) {
                            setStep(-1);
                        } else {
                            if(expectedXCHAmount > xchAmount) {
                                const newOfferData = {...data};
                                newOfferData.request[0][2] = expectedXCHAmount;
                                console.log("Updating offer data");
                                setGenerateOfferData(newOfferData);
                            }
                            setStep(2);
                        }
                    }
                } else {
                    const takeAssetsFromOffer = data.offer.length === 2;

                    var token0Amount: number,
                        token0IsXCH: boolean,
                        token1Amount: number,
                        liquidityAmount: number;

                    if(takeAssetsFromOffer) {
                        token0Amount = data.offer[0][2];
                        token0IsXCH = data.offer[0][1];
                        token1Amount = data.offer[1][2];
                        liquidityAmount = data.request[0][2];
                    } else {
                        token0Amount = data.request[0][2];
                        token0IsXCH = data.request[0][1];
                        token1Amount = data.request[1][2];
                        liquidityAmount = data.offer[0][2];
                    }

                    var xchAmount: number = token0Amount,
                        tokenAmount: number = token1Amount;
                    if(!token0IsXCH) {
                        xchAmount = token1Amount;
                        tokenAmount = token0Amount;
                    }
                    
                    const pair = pairAndQuote![0];
                    var expectedTokenAmount = tokenAmount;
                    var expectedXCHAmount = getLiquidityQuote(tokenAmount, pair.token_reserve, pair.xch_reserve, false);
                    var expectedLiquidityAmount = getLiquidityQuote(tokenAmount, pair.token_reserve, pair.liquidity, false);

                    if(data.action === ActionType.ADD_LIQUIDITY) {
                        expectedXCHAmount -= expectedLiquidityAmount;
                    } else {
                        expectedLiquidityAmount = liquidityAmount;
                        expectedXCHAmount = getLiquidityQuote(liquidityAmount, pair.liquidity, pair.xch_reserve, true);
                        expectedXCHAmount += expectedLiquidityAmount;
                        expectedTokenAmount = getLiquidityQuote(liquidityAmount, pair.liquidity, pair.token_reserve, true);
                    }
                    if(expectedXCHAmount > xchAmount || expectedLiquidityAmount > liquidityAmount || expectedTokenAmount > tokenAmount) {
                        console.log({tokenAmount, expectedXCHAmount, xchAmount, expectedLiquidityAmount, liquidityAmount})
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
                    devFee * (data.offer[0][1] ? data.offer[0][2] : data.request[0][2])
                );
                setOfferResponse(offerResponse);
            }
        }

        if([0, 3].includes(step)) {
            namelessFunction();
        }
    }, [data, step, pairAndQuote, offer, offerResponse, setGenerateOfferData, devFee]);

    const listAssets = (a: [Token, boolean, number][], isOfferingAsset: boolean) => {
        const amountWithFee = (e: [Token, boolean, number]) => {
            // SWAP BUY (add fee to XCH amount)
            if (data.action === "SWAP" && isOfferingAsset && data.offer[0][1]) { // If swap, Buy, Offering XCH
                return (e[2] + Math.floor(e[2] * devFee)) / Math.pow(10, e[1] ? 12 : 3);
            } else if (data.action === "SWAP" && !isOfferingAsset && data.offer[0][1]) { // If swap, Buy, Requesting
                return e[2] / Math.pow(10, e[1] ? 12 : 3);
            } 
            // SWAP SELL (subtract fee from XCH amount)
            else if (data.action === "SWAP" && isOfferingAsset && !data.offer[0][1]) { // If swap, Sell, Offering
                return e[2] / Math.pow(10, e[1] ? 12 : 3);
            } else if (data.action === "SWAP" && !isOfferingAsset && !data.offer[0][1]) { // If swap, Sell, Requesting XCH
                return (e[2] - Math.floor(e[2] * devFee)) / Math.pow(10, e[1] ? 12 : 3);
            } 
            // Liquidity (no fees required)
            else {
                return (e[2] / Math.pow(10, e[1] ? 12 : 3))
            }
        }

        return (
            <ul className="list-none m-0 font-medium">
                {a.map(e => (
                    <li key={e[0].asset_id} className="flex-col gap-2 items-center pb-2 last:pb-0">
                        {/* If swap, add dev fee on top of quote */}
                        <div className="flex gap-2 items-center">
                            <Image src={e[0].image_url} width={30} height={30} alt="Token logo" className="rounded-full outline-brandDark/20 p-0.5" />
                            <p>{amountWithFee(e)}</p>
                            <p>{process.env.NEXT_PUBLIC_XCH === "TXCH" && e[0].name === "Chia" ? "Testnet Chia" : e[0].name === "Pair Liquidity Token" ? e[0].short_name : e[0].name}</p>
                        </div>
                        
                        {e[1] ? null :
                        (<div className="rounded-lg mt-2 mb-4 flex gap-2 ml-4">
                            <div className="flex gap-2 text-sm font-normal pl-[calc(0.5rem+12px)]">
                                <CopyButton copyText={e[0].asset_id}>Asset ID</CopyButton>
                                <AddAssetButton asset_id={e[0].asset_id} short_name={e[0].short_name} image_url={e[0].image_url} name={e[0].name} />
                            </div>
                        </div>)
                        }
                    </li>
                ))}
            </ul>
        );
    };
    

    
    const dispatch = useAppDispatch();
    const connectedWallet = useSelector((state: RootState) => state.wallet.connectedWallet);
    
    const completeWithWallet = async () => {
        if (!connectedWallet) return;

        console.log('Completing with wallet')
        const requestAssets = data.request.map(asset => (
                {
                    assetId: asset[0].asset_id,
                    amount: data.action === "SWAP" && !data.offer[0][1] ? Math.ceil(asset[2] * (1-devFee)) : asset[2],
                    image_url: asset[0].image_url,
                    short_name: asset[0].short_name,
                    name: asset[0].name
                }
            ))

        const offerAssets = data.offer.map(asset => (
                {
                    assetId:  asset[0].asset_id,
                    amount: data.action === "SWAP" && data.offer[0][1] ? Math.floor(asset[2] * (1+devFee)) : asset[2],
                    image_url: asset[0].image_url,
                    short_name: asset[0].short_name,
                    name: asset[0].name
                }
            ))

        const fee = Number((pairAndQuote![1].fee / Math.pow(10, 12)).toFixed(12))

        try {
            const response = await dispatch(generateOffer({requestAssets, offerAssets, fee}))
            if (response.payload && typeof response.payload === 'string') {
                setOffer(response.payload);
                setStep(3);
            }
        } catch (error: any) {
            console.log(error)
        }

    }


    const renderContent = (step: number) => {
        // Loading (verify data)
        if(step === 0) {
            return (
                <div className="mt-16 mb-16 flex justify-center items-center flex-col">
                    <BarLoader width={164} speedMultiplier={2} color={"#526e78"} />
                    <div className='mt-4 font-medium'>Verifying trade data</div>
                </div>
            );
        };
        // Verified - display summary of order & ask user to confirm
        if(step === 2) {

            // Calculate whether the suggested fee is too high
            const fee = pairAndQuote![1].fee / parseFloat(Math.pow(10, 12).toFixed(12));
            const findChiaAmount = () => (data.offer.find(item => item[1]) || data.request.find(item => item[1]) || [])[2]; // Look through order data and find Chia amount
            const chiaAmount = findChiaAmount();
            const chiaAmountProper = chiaAmount ? (Math.floor(chiaAmount)) / Math.pow(10, 12) : null;
            const ishighFee = chiaAmountProper ? fee > chiaAmountProper * 0.1 : false;

            return (
                <div className="text-left w-full">
                    <div className="mb-4 bg-brandDark/10 rounded-xl p-4">
                        <p className="mb-4 font-medium text-2xl text-brandDark dark:text-brandLight">Offering</p>
                        {listAssets(data.offer, true)}
                    </div>

                    <div className="mb-4 mt-4 bg-brandDark/10 rounded-xl p-4">
                        <p className="mb-4 font-medium text-2xl text-brandDark dark:text-brandLight">Requesting</p>
                        {/* <CircularLoadingBar percent={dataRefreshPercent} /> */}
                        {listAssets(data.request, false)}
                    </div>
                    
                    <p className="py-4 px-4 font-medium mb-12 bg-brandDark/10 rounded-xl">
                        <span>Suggested fee</span>
                        <span className="font-normal pl-2">{fee} {process.env.NEXT_PUBLIC_XCH}</span>
                    </p>

                    {/* High fee warning banner */}
                    {ishighFee && (
                    <div className="bg-red-400/50 dark:bg-red-400/20 rounded-xl text-red-700 dark:text-red-600 p-4 mb-4 flex items-center gap-4">
                      <p className="font-medium text-sm">Our suggested fee seems high compared to your trade size. You might want to wait for the next block, or try with a lower fee.</p>
                    </div>
                    )
                    }

                    {/* Complete with Wallet Integration Button */}
                    {connectedWallet && <button className="bg-brandDark hover:opacity-90 bg-gradient-to-br from-[#7fa9b8]/90 to-brandDark/90 dark:from-brandDark dark:to-[#152f38] text-brandLight w-full py-4 rounded-xl font-medium" onClick={completeWithWallet}>Use Wallet to Complete Order</button>}
                    {connectedWallet && <p className="flex w-full justify-center font-medium my-4">— OR —</p>}

                    {/* Input for user to paste manually generated offer in */}
                    <input type="text"
                        value={offer}
                        className='w-full py-4 px-4 border text-brandDark dark:border-brandDark dark:bg-brandDark/20 rounded-xl focus:outline-none focus:ring focus:ring-brandDark/40'
                        onChange={e => setOffer(e.target.value)}
                        placeholder='Generate the offer and paste it here'
                    />

                    {/* Submit offer manually button */}
                    <button
                        onClick={() => setStep(3)}
                        className={`${offer.length === 0 ? 'cursor-not-allowed opacity-20' : 'hover:opacity-90 opacity-100'} bg-gradient-to-br from-[#7fa9b8]/90 to-brandDark/90 dark:from-brandDark dark:to-[#152f38] text-brandLight px-4 py-4 rounded-xl w-full mt-4 font-medium`}
                        disabled={offer.length === 0}
                    >
                        Submit Manually
                    </button>
                </div>
            )
        };
        // Amounts don't match screen
        if(step === -1) {
            return (
                <div className="mt-16 mb-16 flex justify-center items-center flex-col font-medium">
                    <div>Oops! Amounts don{"'"}t match anymore.</div>
                    <div>Please go back and try again.</div>
                </div>
            );
        };
        // Send order to server & display response
        if(step == 3) {
            if(offerResponse === null) {
                return (
                <div className="mt-16 mb-16 flex justify-center items-center flex-col">
                    <RingLoader size={64} color={"#526e78"} />
                    <div className='mt-4 font-medium'><p>Sending offer</p></div>
                </div>
                );
            };

            const handleCopyErrorButtonClick = () => {
                const message = offerResponse?.message;
                if (message) {
                  navigator.clipboard.writeText(message)
                    .then(() => {
                      console.log('Text copied to clipboard:', message);
                      setCopyErrorMessageSuccess(true);
                      setTimeout(() => {
                        setCopyErrorMessageSuccess(false);
                      }, 3000);
                    })
                    .catch((error) => {
                      console.error('Failed to copy text to clipboard:', error);
                    });
                }
              };

            const displayErrorMessage = () => {
                const error = offerResponse.message;
                console.log('❗ Display this error message to support if required:', error)

                if (error?.includes("Invalid Offer")) {
                    return <p>Your offer was invalid. Please try again.</p>
                } else if (error?.includes("UNKNOWN_UNSPENT")) {
                    return <p>Please wait ~1 minute before making another transaction</p>
                } else {
                    const regex = /'error': 'Failed to include transaction (\w+), error ([^']+)'/;
                    const match = regex.exec(error);
                    if (match) {
                        const transactionId = match[1];
                        const errorMessage = match[2];
                        return (<>
                                <div className="text-base flex gap-2">
                                    <p className="w-36 font-medium whitespace-nowrap dark:text-red-600">Transaction ID</p>
                                    <input type="text" value={transactionId} readOnly className="w-full bg-red-700/10 rounded-lg px-2 py-0 text-red-700/90 font-mono animate-fadeIn focus:outline-none focus:ring-2 focus:ring-red-700/20" />
                                </div>
                                <div className="mt-2 text-base flex gap-2">
                                    <p className="w-36 font-medium whitespace-nowrap dark:text-red-600">Reason</p>
                                    <input type="text" value={errorMessage} readOnly className="w-full bg-red-700/10 rounded-lg px-2 py-0 text-red-700/90 font-mono animate-fadeIn focus:outline-none focus:ring-2 focus:ring-red-700/20" />
                                </div>
                            </>)
                    } else {
                        return (
                            <>
                                <p>An error occurred while trying to submit your offer.</p>
                                <textarea className="mt-4 dark:text-brandLight/50 min-h-[10rem] text-brandDark w-full py-2 px-2 border-2 border-transparent bg-brandDark/10 rounded-xl focus:outline-none focus:border-brandDark/20" value={error} readOnly />
                            </>
                        );
                    }
                }

            }

            return (
                <div className="mt-16 mb-16">
                    <div className="flex flex-col">
                        {!offerResponse!.success && (<>
                            <div className="bg-red-400/50 dark:bg-red-400/20 rounded-xl text-red-700 dark:text-red-600 p-4 sm:p-8 mt-8 flex flex-col">
                                <div className="flex gap-2 items-center mb-8">
                                    <CrossIcon className="w-6 h-6 fill-red-700 dark:fill-red-600" />
                                    <span className="font-medium text-2xl">Failed to complete {activeTab === 'swap' ? 'swap' : 'transaction'}</span>
                                </div>
                                {displayErrorMessage()}
                                <button onClick={handleCopyErrorButtonClick} className={`${copyErrorMessageSuccess ? 'bg-green-700/70 dark:bg-green-700/50' : 'bg-red-700/70'} text-center text-base font-medium w-full py-2 px-4 rounded-lg mt-8 hover:opacity-90 text-brandLight`}>{copyErrorMessageSuccess ? 'Copied Successfully' : 'Copy Full Error'}</button>
                                <a href="https://discord.gg/Z9px4geHvK" target="_blank" className="text-center text-base font-medium w-full py-4 px-4 rounded-lg mt-2 bg-[#5865F2] hover:opacity-90 text-brandLight">Join our discord for support</a>
                            </div>
                        </>)}
                    </div>
                    {offerResponse!.success && <SuccessScreen offerData={data} devFee={devFee} offerResponse={offerResponse} />}
                </div>



            );
        };

        return (
            <div className="mt-16 mb-16 flex justify-center items-center flex-col font-medium">
                <div>Something went wrong - please refresh this page</div>
                <a href="https://discord.gg/Z9px4geHvK" target="_blank" className="text-center text-xl font-medium w-full py-2 px-4 rounded-lg mt-4 bg-[#5865F2] hover:opacity-90 text-brandLight">Join our discord for support</a>
            </div>
        );
    };

    return (
        <div className="w-full h-full">
            { renderContent(step) }
        </div>
  );
};

export default GenerateOffer;
