import { FormEvent, useState } from 'react';
import { flushSync } from 'react-dom';

import PreliminaryBanner from '@/components/refund/PreliminaryBanner';
import CopyButton from '@/components/shared/CopyButton';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { checkAssets, type RefundAssetGroup } from '@/lib/refund/checkAssets';
import { formatCatAmount, formatXchAmount } from '@/lib/refund/formatAmount';

function AssetResultCard({ group }: { group: RefundAssetGroup }) {
  const isXch = group.assetId === null;
  const dexieOk = group.dexie?.status === 'ok';
  const ticker = isXch ? 'XCH' : dexieOk ? group.dexie?.ticker : null;
  const name = isXch ? 'Chia' : dexieOk ? group.dexie?.name : null;
  const imageUrl = !isXch && dexieOk ? group.dexie?.imageUrl ?? null : null;
  const amountLabel = isXch ? formatXchAmount(group.amount) : formatCatAmount(group.amount);
  const showIdentity = isXch || dexieOk;

  return (
    <div className="bg-brandDark/10 rounded-xl px-4 py-4 space-y-3">
      {showIdentity ? (
        <div className="flex items-center gap-3">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={ticker ?? 'Token'} className="w-10 h-10 rounded-full bg-brandLight" />
          ) : isXch ? (
            <div className="w-10 h-10 rounded-full bg-brandDark/20 flex items-center justify-center text-xs font-semibold">
              XCH
            </div>
          ) : null}
          <div className="min-w-0">
            {ticker ? <p className="font-semibold">{ticker}</p> : null}
            {name ? <p className="text-sm opacity-70">{name}</p> : null}
          </div>
        </div>
      ) : null}

      <p className="text-2xl font-bold">
        {amountLabel}{ticker ? ` ${ticker}` : ''}
      </p>

      {group.assetId ? (
        <div className="flex items-start gap-2 flex-wrap">
          <p className="font-mono text-sm break-all flex-1 min-w-0">{group.assetId}</p>
          <CopyButton copyText={group.assetId}>Copy</CopyButton>
        </div>
      ) : null}

      <div>
        <p className="text-sm font-medium pb-1">Addresses with a match</p>
        <ul className="space-y-1">
          {group.addresses.map((address) => (
            <li key={address} className="font-mono text-sm break-all">{address}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function CheckClient() {
  const [input, setInput] = useState('');
  const [progress, setProgress] = useState('');
  const [running, setRunning] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [groups, setGroups] = useState<RefundAssetGroup[] | null>(null);
  const [lookedUpCount, setLookedUpCount] = useState(0);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setRunning(true);
    setErrors([]);
    setGroups(null);
    setLookedUpCount(0);
    setProgress('');

    try {
      const result = await checkAssets(input, (message) => {
        flushSync(() => setProgress(message));
      });
      setErrors(result.errors);
      if (result.lookedUpAddresses.length > 0 || result.groups.length > 0) {
        setLookedUpCount(result.lookedUpAddresses.length);
        setGroups(result.groups);
      } else {
        setLookedUpCount(0);
        setGroups(null);
      }
      setProgress('');
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Something went wrong while checking assets.']);
      setProgress('');
    } finally {
      setRunning(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto">
      <h1 className="text-[2.75rem] leading-10 sm:text-5xl font-bold pb-8">Check your assets</h1>

      <div className="mb-8">
        <PreliminaryBanner />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="bg-brandDark/10 p-2 rounded-xl">
          <label htmlFor="refund-input" className="text-sm font-medium px-2 bg-transparent leading-normal">
            Addresses and observer keys
          </label>
          <div className="p-2">
            <textarea
              id="refund-input"
              className="w-full text-sm sm:text-base font-mono px-2 py-2 focus:outline-none bg-transparent leading-normal resize-y min-h-[9rem]"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="xch1… addresses and 96-character observer public keys"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>

        <p className="text-sm leading-relaxed opacity-80">
          This checker can only expand <span className="font-medium">unhardened</span> children from a pasted observer key.
          Hardened-path addresses cannot be derived from a public key — paste those <span className="font-mono">xch1</span> addresses instead.
        </p>

        <button
          type="submit"
          disabled={running}
          className="inline-flex items-center justify-center gap-2 font-medium px-6 py-3 rounded-xl bg-brandDark text-brandLight hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? <LoadingSpinner width="1.25rem" /> : null}
          Check your assets
        </button>
      </form>

      {progress ? (
        <p className="mt-6 text-sm font-medium">{progress}</p>
      ) : null}

      {errors.length > 0 ? (
        <div className="mt-6 bg-red-700/10 text-red-800 dark:text-red-200 rounded-xl px-4 py-4 space-y-1">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}

        {groups ? (
          <div className="mt-8 space-y-4">
            <p className="text-sm opacity-70">Looked up {lookedUpCount} address{lookedUpCount === 1 ? '' : 'es'}.</p>
          {groups.length === 0 ? (
            <p className="leading-relaxed">No refunds for these addresses in the current snapshot.</p>
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <AssetResultCard key={group.assetId ?? 'xch'} group={group} />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </main>
  );
}
