import type { GenerateOfferData } from './TabContainer';
import { Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import confetti from 'canvas-confetti';
import Image from "next/image";

interface SuccessScreenProps {
    offerData: GenerateOfferData;
    devFee: number;
}

function SuccessScreen({ offerData, devFee }: SuccessScreenProps) {
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
                <div className={`absolute overflow-x-clip top-0 w-full p-8 py-12 flex flex-col justify-center bg-brandDark bg-gradient-to-br from-[#7fa9b8] to-brandDark dark:from-brandDark dark:to-[#152f38] rounded-xl`}>
                    <p className="text-brandLight text-5xl mb-4 font-bold">Sent</p>
                    {offerData.offer.map(asset => (
                        <div key={asset[0].asset_id} className="text-brandLight flex items-center gap-2 font-medium">
                            <Image src={asset[0].image_url} width={30} height={30} alt="Token logo" className="rounded-full" />
                            <p>{offerData.action === "SWAP" ? (asset[2] / Math.pow(10, asset[1] ? 12 : 3)) * (1+devFee) : (asset[2] / Math.pow(10, asset[1] ? 12 : 3))}</p> {/* If transaction type is swap, add dev fee on top of offer amount */}
                            <p>{asset[0].short_name}</p>
                        </div>
                    ))}

                    <p className="text-brandLight text-5xl mb-4 mt-12 font-bold">Received</p>
                    {offerData.request.map(asset => (
                        <div key={asset[0].asset_id} className="text-brandLight flex items-center gap-2 font-medium pb-2">
                            <Image src={asset[0].image_url} width={30} height={30} alt="Token logo" className="rounded-full" />
                            <p>{(asset[2] / Math.pow(10, asset[1] ? 12 : 3))}</p>
                            <p>{asset[0].short_name}</p>
                        </div>
                    ))}
                </div>
            </Transition>
            
        </div>
     );
}

export default SuccessScreen;