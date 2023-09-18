import ChevronUpDownIcon from '../icons/ChevronUpDownIcon';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface FingerprintListboxProps {
  fingerprints: number[] | undefined;
  userSelectedFingerprint: number | undefined;
  setUserSelectedFingerprint: (value: number) => void;
}

function FingerprintListbox({ fingerprints, userSelectedFingerprint, setUserSelectedFingerprint }: FingerprintListboxProps) {

  const handleChange = (value: number) => {
    setUserSelectedFingerprint(value);
  }

  // Don't display anything until fingerprint(s) exist
  if (!fingerprints || !userSelectedFingerprint) return <></>

  // Don't display listbox if only one fingerprint exists
  if (fingerprints.length === 1) {
    return <p className="text-xs">{fingerprints[0]}</p>
  }

  // Display listbox if multiple fingerprints are given
  return ( 
      <Listbox value={userSelectedFingerprint} onChange={handleChange}>
        <div className="relative" title="Select fingerprint">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg pr-5 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-brandDark text-xs">
            <span className="block truncate">{userSelectedFingerprint}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
              <ChevronUpDownIcon
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in-out duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
            enter="transition ease-in-out duration-100"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-brandLight dark:bg-zinc-900 ring-1 ring-black ring-opacity-5 focus:outline-none text-xs">
              {fingerprints.map((fingerprint, index) => (
                <Listbox.Option
                  key={fingerprint}
                  className={({ active }) =>
                    `relative select-none py-1 px-2 ${
                      active ? 'bg-brandLight/20' : 'text-black dark:text-brandLight'
                    }`
                  }
                  value={fingerprint}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium text-green-700' : 'font-normal'
                        }`}
                      >
                        {fingerprint}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
  );
}

export default FingerprintListbox;