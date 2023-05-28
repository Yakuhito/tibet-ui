import { ChangeEvent, KeyboardEvent, Fragment, useState } from 'react'
import { Dialog, Transition, RadioGroup } from '@headlessui/react'

interface DevFeeModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    setDevFee: (value: number) => void;
}

function DevFeeModal({ isOpen, setIsOpen, setDevFee }: DevFeeModalProps) {

    // Current value of custom dev fee input
    const [customInputValue, setCustomInputValue] = useState<number | string>("");

    // Dev fee options user can select
    const options = [
        {id: 0, label: 'Default', value: 0.3},
        {id: 1, label: 'Thank You 🎉', value: 0.7},
        {id: 2, label: 'Custom 🙌', value: customInputValue}
    ]

    // Restrict custom fee input number value to between 0 & 100
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        if (inputValue === "") setCustomInputValue(0.00)
        if (Number(inputValue) >= 0 && Number(inputValue) <= 100) {
            setCustomInputValue(inputValue);
            setDevFee(Number(inputValue)/100)
        }
    };

    // Prevent characters like e, +, - in custom fee input
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
        if (!/[0-9.]/.test(event.key) && !allowedKeys.includes(event.key)) {
              event.preventDefault();
        }
    }

    // Track selected option in modal
    const [selectedOption, setSelectedOption] = useState(0);

    // Executes when user switches option
    const handleOptionChange = (option: number) => {
        setSelectedOption(option)
        setDevFee(Number(options[option].value)/100)
    }


    return ( 
        <>
            {/* dev fee (editable) - 0.3% (0.3%, 0.7%, custom) (if 0%, yak goes hungry) */}
      
            <Transition appear show={isOpen} as={Fragment}>
              <Dialog as="div" className="relative z-20" onClose={() => setIsOpen(false)}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-brandDark/10 backdrop-blur-sm" />
                </Transition.Child>
      
                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">

                        <Dialog.Title as="h3" className="text-5xl pt-8 pb-4 font-bold leading-6 text-black dark:text-brandLight">Dev Fee</Dialog.Title>

                        {/* Options */}
                        <div className="my-8">
                          <RadioGroup className="flex flex-col gap-4" value={selectedOption} onChange={handleOptionChange}>

                            {options.map((option) => (
                                <RadioGroup.Option key={option.id} value={option.id} className="outline-none">
                                  {({ active, checked }) => (
                                  <div className={`${checked ? 'border-brandDark border-2' : 'border-2 border-transparent hover:border-brandDark/10'} ${active ? 'ring-4 ring-brandDark/20' : ''} py-8 px-8 rounded-xl cursor-pointer bg-brandDark/10`}>
                                    {option.label === "Custom 🙌" &&
                                    <>
                                      <p className="font-medium">Custom 🙌</p>
                                      <RadioGroup.Description className="relative flex items-center text-4xl">
                                        <input value={customInputValue} onKeyDown={handleKeyDown} onChange={handleChange} pattern="[0-9]*" inputMode="decimal" type="number" min={0} max={100} name="customDevFee" id="customDevFee" placeholder="Custom" className="font-bold bg-transparent w-full outline-none" />
                                        <p className="absolute right-0 font-bold">%</p>
                                      </RadioGroup.Description>
                                    </>
                                    }
                                    {option.label !== "Custom 🙌" &&
                                    <>
                                      <p className="font-medium">{option.label}</p>
                                      <p className="font-bold text-4xl">{option.value}%</p>
                                    </>
                                    }
                                  </div>
                                  )}
                                </RadioGroup.Option>
                            ))}

                          </RadioGroup>

                        </div>
      
                        <div className="mt-4">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-xl border border-transparent bg-brandDark px-4 py-4 w-full font-medium text-brandLight hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brandDark focus-visible:ring-offset-2"
                            onClick={() => setIsOpen(false)}
                          >
                            Confirm
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </>
     );
}

export default DevFeeModal;