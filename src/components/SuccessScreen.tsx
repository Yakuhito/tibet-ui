import type { GenerateOfferData } from './TabContainer';
import { Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import type { OfferResponse } from '@/api';
import confetti from 'canvas-confetti';
import Image from "next/image";

interface SuccessScreenProps {
    offerData: GenerateOfferData;
    devFee: number;
    offerResponse: OfferResponse | null;
}

function SuccessScreen({ offerData, devFee, offerResponse }: SuccessScreenProps) {
    const [isShowing, setIsShowing] = useState(true) // true when logo animation is happening

    // Display confetti after logo animation
    useEffect(() => {
      const handleConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 1 }, // Start position of the confetti (from the top 0-1)
        });
      };

      !isShowing ? handleConfetti() : '';
    }, [isShowing]);
      
    // Hide logo animation & show transaction result by setting isShowing state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShowing(false);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return ( 
        <div className="flex justify-center items-center relative">

            {/* Logo animation */}
            <Transition
                as={Fragment}
                show={isShowing}
                appear={true}
                enter="transform transition duration-[400ms]"
                enterFrom="opacity-0 rotate-[-120deg] scale-50"
                enterTo="opacity-100 rotate-0 scale-100"
                leave="transform duration-200 transition ease-in-out"
                leaveFrom="opacity-100 rotate-0 scale-100 "
                leaveTo="opacity-0 scale-90 "
            >
                <Image src="/logo.jpg" width={200} height={200} alt="YakSwap logo" className="absolute top-0 rounded-full border-neutral-300 hover:translate-y-1 hover:opacity-80 transition dark:opacity-80" />
            </Transition>


            {/* Show transaction details */}
            <Transition
                as={Fragment}
                show={!isShowing}
                appear={true}
                enter="transform transition delay-0 duration-[400ms]"
                enterFrom="opacity-0 rotate-0 scale-50"
                enterTo="opacity-100 rotate-0 scale-100"
                leave="transform duration-200 transition ease-in-out"
                leaveFrom="opacity-100 rotate-0 scale-100 "
                leaveTo="opacity-0 scale-95 "
            >
                <div className={`absolute overflow-x-clip top-0 w-full p-8 flex flex-col justify-center bg-brandDark bg-gradient-to-br from-[#7fa9b8] to-brandDark dark:from-brandDark dark:to-[#152f38] rounded-xl`}>
                    <p className="text-brandLight text-5xl mb-4 font-bold">Sent</p>
                    {offerData.offer.map(asset => (
                        <div key={asset[0].asset_id} className="text-brandLight flex items-center gap-2 font-medium pb-2 last:pb-0">
                            <Image src={asset[0].image_url} width={30} height={30} alt="Token logo" className="rounded-full" />
                            <p>{asset[0].short_name === process.env.NEXT_PUBLIC_XCH ? (asset[2] + Math.floor(asset[2] * devFee)) / Math.pow(10, asset[1] ? 12 : 3) : (asset[2] / Math.pow(10, asset[1] ? 12 : 3))}</p> {/* If asset is XCH, add dev fee on top of amount */}
                            <p>{asset[0].short_name}</p>
                        </div>
                    ))}

                    <p className="text-brandLight text-5xl mb-4 mt-12 font-bold">Received</p>
                    {offerData.request.map(asset => (
                        <div key={asset[0].asset_id} className="text-brandLight flex items-center gap-2 font-medium pb-2 last:pb-0">
                            <Image src={asset[0].image_url} width={30} height={30} alt="Token logo" className="rounded-full" />
                            <p>{asset[0].short_name === process.env.NEXT_PUBLIC_XCH ? (asset[2] - Math.floor(asset[2] * devFee)) / Math.pow(10, asset[1] ? 12 : 3) : (asset[2] / Math.pow(10, asset[1] ? 12 : 3))}</p> {/* If asset is XCH, substract dev fee from amount */}
                            <p>{asset[0].short_name}</p>
                        </div>
                    ))}
                    {/* Track status on Dexie Button */}
                    {offerResponse?.offer_id && (
                        <a href={`https://${process.env.NEXT_PUBLIC_XCH === "TXCH" && "testnet."}dexie.space/offers/${offerResponse.offer_id}`} target="_blank" className="bg-brandLight dark:bg-brandLight/80 dark:text-black rounded-xl py-4 flex items-center font-medium justify-center mt-12 hover:opacity-90">

                            {/* Dexie Duck Icon */}
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8"
                                 width="635.000000pt" height="710.000000pt" viewBox="0 0 635.000000 710.000000">
                                <g transform="translate(0.000000,710.000000) scale(0.100000,-0.100000)"
                                fill="#4655ff" stroke="none">
                                <path d="M3347 6639 c-330 -27 -565 -181 -788 -518 -176 -266 -274 -557 -300
                                -892 -12 -169 -26 -215 -79 -263 -43 -39 -49 -40 -276 -84 -173 -33 -325 -79
                                -482 -143 -290 -121 -393 -229 -487 -512 -63 -192 -164 -554 -176 -637 -24
                                -164 3 -377 72 -585 66 -196 234 -502 388 -704 l59 -77 4 -135 c3 -133 4 -138
                                40 -210 58 -116 59 -123 73 -324 l13 -190 -26 -27 c-39 -42 -43 -120 -8 -171
                                27 -40 28 -65 1 -87 -22 -18 -18 -32 6 -25 l22 7 -21 -28 c-11 -16 -62 -76
                                -114 -133 -182 -204 -198 -228 -198 -303 0 -38 23 -103 41 -114 5 -3 50 11
                                101 30 129 47 220 60 386 53 149 -6 260 -28 400 -77 48 -17 91 -32 96 -33 5
                                -1 14 16 20 38 30 112 145 205 336 271 36 13 66 29 68 37 5 24 -38 66 -102 97
                                -50 25 -84 33 -162 41 -275 25 -462 87 -587 193 -46 38 -49 43 -44 79 8 55 -9
                                101 -48 136 -42 37 -51 71 -64 246 -9 113 -6 349 5 383 2 8 19 0 50 -24 192
                                -146 617 -237 1179 -253 l230 -6 3 -50 c3 -52 3 -52 -63 -141 -9 -12 -19 -41
                                -23 -65 -7 -41 -14 -49 -97 -112 -55 -41 -150 -97 -243 -144 -94 -46 -171 -92
                                -200 -118 l-47 -43 50 -6 c132 -17 337 -87 590 -203 131 -60 140 -63 152 -46
                                52 74 125 119 250 155 71 21 98 23 315 23 273 0 255 -10 190 104 l-37 65 -112
                                32 c-62 18 -157 52 -210 76 -113 51 -292 154 -298 171 -2 7 -6 28 -9 48 -4 21
                                -18 54 -32 75 -24 35 -26 43 -19 111 l7 73 86 46 c302 162 435 242 588 357
                                383 287 578 650 561 1047 -10 259 -82 439 -326 815 -71 110 -150 232 -176 271
                                -59 92 -172 211 -305 322 -89 75 -110 98 -139 155 -30 58 -34 76 -34 140 0 57
                                5 82 22 113 46 81 111 106 409 155 197 32 206 33 320 21 211 -21 478 -103 584
                                -179 67 -48 229 -118 346 -149 77 -20 133 -27 273 -33 176 -8 176 -8 256 -45
                                86 -41 125 -43 156 -8 43 50 22 117 -63 194 -61 56 -126 98 -385 248 -289 168
                                -474 298 -601 424 -87 87 -110 127 -143 249 -110 404 -487 726 -928 792 -106
                                16 -145 17 -296 4z m527 -543 c51 -21 76 -60 76 -118 0 -79 -47 -128 -125
                                -128 -76 0 -128 54 -128 133 0 46 26 85 74 109 41 22 59 22 103 4z"/>
                                </g>
                            </svg>
                            Track Offer On Dexie
                        </a>
                    )}

                </div>

            </Transition>
            
        </div>
     );
}

export default SuccessScreen;
