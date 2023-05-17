import { ActionType, createOfferForPair, getInputPrice, getLiquidityQuote, getOutputPrice, getPairByLauncherId, getQuoteForPair } from '@/api';
import type { OfferResponse, Pair, Quote, Token } from '@/api';
import type { GenerateOfferData } from './TabContainer';
import RingLoader from 'react-spinners/RingLoader';
import { useEffect, useState } from 'react';
import SuccessScreen from './SuccessScreen';
import toast from 'react-hot-toast';

type GenerateOfferProps = {
  data: GenerateOfferData;
  setOrderRefreshActive: (value: boolean) => void;
  devFee: number;
  dataRefreshPercent: number;
  setGenerateOfferData: (value: GenerateOfferData) => void;
  setDataRefreshPercent: (value: number) => void;
  activeTab: 'swap' | 'liquidity';
};

const GenerateOffer: React.FC<GenerateOfferProps> = ({ data, setOrderRefreshActive, devFee, setGenerateOfferData, setDataRefreshPercent, activeTab }) => {
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

    // Update pair rates every 4 seconds
    useEffect(() => {
        const fetchUpdatedPairDataInterval = setInterval(async () => {
            const newPairData = await getPairByLauncherId(data.pairId);
            setPair(newPairData)
        }, 4000)
        return () => clearInterval(fetchUpdatedPairDataInterval)
    }, [data.pairId])


    // Update order rates every 5 seconds
    useEffect(() => {
        // Update Swap Offer Data Function
        const updateOfferDataSwap = () => {
            if (pair) {
                const newOfferData = {...data};
                const isBuy = newOfferData.offer[0][0].short_name === "XCH";
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

            setDataRefreshPercent(0)
        }


        // Update Liquidity Offer Data Function
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
                  var xchAmount = getLiquidityQuote(liquidityTokens, liquidity, xch_reserve, true);
                  xchAmount += liquidity;
                
                  newOfferData.request[0][2] = xchAmount; // Update Amount0
                  newOfferData.request[1][2] = tokenAmount; // Update Amount1

                  console.log("Updating offer data");
                  setGenerateOfferData(newOfferData);
                }
            }

      }
        
        const refreshDataInterval = setInterval(activeTab === 'swap' ? updateOfferDataSwap : updateOfferDataLiquidity, 5000)

        return () => clearInterval(refreshDataInterval)
    }, [data, setGenerateOfferData, pair, setDataRefreshPercent, activeTab])

    
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
                setOrderRefreshActive(true)
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
                            setOrderRefreshActive(false);
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
                            setOrderRefreshActive(false);
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
                    const takeAssetsFromOfferingSide = data.offer.length === 2;

                    var token0Amount: number,
                        token0IsXCH: boolean,
                        token1Amount: number,
                        liquidityAmount: number;

                    if(takeAssetsFromOfferingSide) {
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

                    console.log({tokenAmount, expectedXCHAmount, xchAmount, expectedLiquidityAmount, liquidityAmount})
                    if(takeAssetsFromOfferingSide) { // adding liquidity
                        if(expectedTokenAmount > tokenAmount) {
                            setStep(-1);
                        }

                        const newOfferData = {...data};
                        newOfferData.offer[0][2] = expectedXCHAmount;
                        newOfferData.offer[1][2] = expectedTokenAmount;
                        newOfferData.request[0][2] = expectedLiquidityAmount;
                        setGenerateOfferData(newOfferData);

                        setStep(2);
                    } else { // removing liquidity
                        if(expectedLiquidityAmount > liquidityAmount) {
                            setStep(-1);
                        }

                        const newOfferData = {...data};
                        newOfferData.request[0][2] = expectedXCHAmount;
                        newOfferData.request[1][2] = expectedTokenAmount;
                        newOfferData.offer[0][2] = expectedLiquidityAmount;
                        setGenerateOfferData(newOfferData);

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
                setOrderRefreshActive(false)
            }
        }

        if([0, 3].includes(step)) {
            namelessFunction();
        }
    }, [data, step, pairAndQuote, offer, offerResponse, setOrderRefreshActive, setGenerateOfferData, devFee]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert(`Copied to clipboard: ${text}`);
        });
    };

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
                    <li key={e[0].asset_id}>
                        {/* If swap, add dev fee on top of quote */}
                        {amountWithFee(e)} {e[0].name}{" "}
                        {e[1] ? <></> : <button
                            className="ml-1 bg-brandDark hover:bg-brandDark/80 text-white px-2 rounded-lg"
                            onClick={() => copyToClipboard(e[0].asset_id)}
                        >
                            Copy Asset ID
                        </button>}
                    </li>
                ))}
            </ul>
        );
    };
    

    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [connectedWallet, setConnectedWallet] = useState(false);
    const [isGobyDetected, setIsGobyDetected] = useState(false);
    
    // Detect whether a wallet is already connected
    useEffect(() => {
        const { chia } = (window as any);
        setIsGobyDetected(Boolean(chia && chia.isGoby));

        const eagerlyConnect = async () => {
            const isSuccessful = await (window as any).chia.request({ method: "connect" , "params": {eager: true}})
            if (isSuccessful) {
                setConnectedWallet(true)
                return true;
            }
            return false;
        }

        if (isGobyDetected) {
            console.log('Goby wallet detected - attempting to eagerly connect')
            eagerlyConnect().then((isConnected) => {
                setConnectedWallet(isConnected);
              });

            (window as any).chia.on("accountChanged", () => {
                eagerlyConnect().then((isConnected) => {
                    setConnectedWallet(isConnected);
                });
            });

        }
    }, [isGobyDetected, connectedWallet])


    const completeWithWallet = async () => {
        console.log('Completing with wallet')
        const requestAssets = data.request.map(asset => (
                {
                    assetId: asset[0].asset_id,
                    amount: data.action === "SWAP" && !data.offer[0][1] ? Math.ceil(asset[2] * (1-devFee)) : asset[2]
                }
            ))

        const offerAssets = data.offer.map(asset => (
                {
                    assetId:  asset[0].asset_id,
                    amount: data.action === "SWAP" && data.offer[0][1] ? Math.floor(asset[2] * (1+devFee)) : asset[2]
                }
            ))

        try {
            const { offer }: any = await generateOffer(requestAssets, offerAssets)
            setOffer(offer);
            setStep(3);
        } catch (error: any) {
            console.log(error)
            toast.error(`Wallet - ${error?.message || String(error)}`);
        }

    }

    const generateOffer = async (requestAssets: {assetId: string; amount: number;}[], offerAssets: {assetId: string; amount: number;}[]): Promise<void> => {
        const params = {
          requestAssets,
          offerAssets
        }
        console.log(params)
        try {
            const response = await (window as any).chia.request({ method: 'createOffer', params })
            console.log('Fetching offer', response)
            return response
        } catch (error: any) {
            toast.error(`${error?.message || String(error)}`);
            throw error;
        }
  
      }


    const renderContent = (step: number) => {
        // Loading (verify data)
        if(step === 0) {
            return (
                <div className="mt-16 mb-16 flex justify-center items-center flex-col">
                    <RingLoader size={64} color={"#526e78"} />
                    <div className='mt-4 font-medium'>Verifying trade data...</div>
                </div>
            );
        };
        // Verified - display summary of order & ask user to confirm
        if(step === 2) {
            return (
                <div className="text-left w-full">
                    <p className="text-4xl font-bold mb-8">Order Summary</p>

                    <div className="bg-brandDark/10 rounded-xl p-4 mb-4">
                        <p className="mb-2 font-medium text-lg text-brandDark">Offering:</p>
                        {listAssets(data.offer, true)}
                    </div>

                    <div className="bg-brandDark/10 rounded-xl p-4 mb-4">
                        <p className="mb-2 font-medium text-lg text-brandDark">Requesting:</p>
                        {/* <CircularLoadingBar percent={dataRefreshPercent} /> */}
                        {listAssets(data.request, false)}
                    </div>

                    <p className="bg-brandDark/10 rounded-xl py-2 px-4 font-medium mb-4">Min fee: <span className="font-normal">{(pairAndQuote![1].fee / Math.pow(10, 12)).toFixed(12)} XCH</span></p>
                    <p className="px-4 mb-4 font-medium">Please generate the offer, paste it below, and click the button to proceed.</p>
                    <input type="text"
                        value={offer}
                        className='w-full py-2 px-4 border-2 text-brandDark dark:border-brandDark dark:bg-brandDark/20 rounded-md focus:outline-none focus:border-brandDark'
                        onChange={e => setOffer(e.target.value)}
                        placeholder='offer1...'
                    />

                    {connectedWallet && <button className="w-full bg-brandDark text-white py-4 rounded-lg mt-4 font-medium" onClick={completeWithWallet}>Use Wallet to Complete Order</button>}
                    <button
                        onClick={() => setStep(3)}
                        className={`${offer.length === 0 ? 'bg-brandDark/10 text-brandDark/20 dark:text-brandLight/30 cursor-not-allowed' : 'bg-green-700'} text-brandLight px-4 py-2 rounded-lg w-full mt-8 font-medium`}
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
                    <div className='mt-4 font-medium'><p>Sending offer...</p></div>
                </div>
                );
            };

            return (
                <div className="mt-16 mb-16">
                    <div className="font-medium">{offerResponse!.success ? '' : offerResponse!.message.includes("Invalid Offer") ? '' : offerResponse!.message.includes("UNKNOWN_UNSPENT") ? '' : 'An error occurred while submitting offer ☹️'}</div>
                    {!offerResponse!.success && !offerResponse!.message.includes("Invalid Offer") && !offerResponse!.message.includes("UNKNOWN_UNSPENT") && <textarea className="mt-4 dark:text-brandLight/30 min-h-[10rem] text-brandDark w-full py-2 px-2 border-2 border-transparent bg-brandDark/10 rounded-xl focus:outline-none focus:border-brandDark" value={offerResponse!.message} readOnly />}
                    {offerResponse!.message.match( /Invalid Offer|UNKNOWN_UNSPENT/ ) && (
                        <div className="flex flex-col">
                            <h2 className="text-xl">{offerResponse!.message.includes("Invalid Offer") ? 'Your offer was invalid. Please try again.' : 'Please wait ~1 minute before making another transaction'}</h2>
                            <a href="https://discord.gg/Z9px4geHvK" target="_blank" className="text-center text-xl font-medium w-full py-2 px-4 rounded-lg mt-4 bg-[#5865F2] hover:opacity-90 text-brandLight">Join our discord for support</a>
                        </div>
                    )}
                    {offerResponse!.success && <SuccessScreen offerData={data} devFee={devFee} />}
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
