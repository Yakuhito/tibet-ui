import PreliminaryBanner from './PreliminaryBanner';

export default function CheckFormShell({ disabled = false }: { disabled?: boolean }) {
  return (
    <main className="max-w-2xl mx-auto">
      <h1 className="text-[2.75rem] leading-10 sm:text-5xl font-bold pb-8">Check your assets</h1>
      <div className="mb-8">
        <PreliminaryBanner />
      </div>
      <form className="space-y-4">
        <div className="bg-brandDark/10 p-2 rounded-xl">
          <label htmlFor="refund-input" className="text-sm font-medium px-2 bg-transparent leading-normal">
            Addresses/Observer Keys
          </label>
          <div className="p-2">
            <textarea
              id="refund-input"
              className="w-full text-sm sm:text-base font-mono px-2 py-2 focus:outline-none bg-transparent leading-normal resize-y min-h-[9rem]"
              placeholder="xch1… addresses and 96-character observer public keys"
              spellCheck={false}
              autoComplete="off"
              disabled={disabled}
              readOnly={disabled}
            />
          </div>
        </div>
        <p className="text-sm leading-relaxed opacity-80">
          This checker can only expand <span className="font-medium">unhardened</span> addresses from a pasted observer key.
          Hardened addresses cannot be derived from a public key - to check, paste those your addresses instead.
        </p>
        <button
          type="submit"
          disabled
          className="inline-flex items-center justify-center gap-2 font-medium px-6 py-3 rounded-xl bg-brandDark text-brandLight hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check
        </button>
      </form>
    </main>
  );
}
