import Head from 'next/head';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import GeneralInput from '@/components/shared/GeneralInput';
import TickIcon from '@/components/shared/icons/TickIcon';
import HexInput from '@/components/shared/HexInput';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AddRcatResponse {
  success: boolean;
  message: string;
}

const AddRcat: React.FC = () => {  
  // Form state
  const [secret, setSecret] = useState<string>('');
  const [assetId, setAssetId] = useState<string>('');
  const [hiddenPuzzleHash, setHiddenPuzzleHash] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [shortName, setShortName] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load secret from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSecret = localStorage.getItem('issuer_secret') || '';
      setSecret(savedSecret);
    }
  }, []);

  // Validation
  const isValidHex = (value: string, length: number): boolean => {
    return /^[0-9a-fA-F]+$/.test(value) && value.length === length;
  };

  const isFormValid = 
    secret.trim() !== '' &&
    isValidHex(assetId, 64) &&
    isValidHex(hiddenPuzzleHash, 64) &&
    name.trim() !== '' &&
    shortName.trim() !== '' &&
    imageUrl.trim() !== '' &&
    confirmed;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);

    localStorage.setItem('issuer_secret', secret);

    try {
      const requestData = {
        secret: secret.trim(),
        asset_id: assetId.toLowerCase(),
        hidden_puzzle_hash: hiddenPuzzleHash.toLowerCase(),
        name: name.trim(),
        short_name: shortName.trim(),
        image_url: imageUrl.trim()
      };

      const response = await axios.post<AddRcatResponse>(`${BASE_URL}/token`, requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Redirect to token page
        window.location.href = `${BASE_URL}/token/${assetId.toLowerCase()}`;
      } else {
        alert(response.data.message);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred while submitting the form. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <main className="max-w-[28rem] mx-auto">
        <div className="rounded-2xl max-w-screen-sm w-full">
          <h1 className="text-[2.75rem] leading-10 sm:text-2xl font-bold pb-2">Add rCAT</h1>

          {/* Warning */}
          <div className="bg-blue-400/50 dark:bg-blue-800/20 rounded-xl text-blue-700 p-4 mt-4 flex items-center gap-4 mb-4 font-medium text-sm animate-fadeIn">
            <p>Welcome back, rCAT issuer!</p>
          </div>

          <div className='space-y-2'>
            <GeneralInput
              value={secret}
              onChange={setSecret}
              helperText="Secret given to you by Yak"
              label='Issuer Secret'
              small={true}
              type='text'
            />
            
            <HexInput
              value={assetId}
              onChange={setAssetId}
              helperText="64-character hex string"
              label='Asset ID'
              small={true}
              expectedLength={64}
            />
            
            <HexInput
              value={hiddenPuzzleHash}
              onChange={setHiddenPuzzleHash}
              helperText="64-character hex string"
              label='Hidden Puzzle Hash'
              small={true}
              expectedLength={64}
            />
            
            <GeneralInput
              value={name}
              onChange={setName}
              helperText="Full token name"
              label='Name'
              small={true}
              type='text'
            />
            
            <GeneralInput
              value={shortName}
              onChange={setShortName}
              helperText="Token symbol/ticker"
              label='Short Name'
              small={true}
              type='text'
            />
            
            <GeneralInput
              value={imageUrl}
              onChange={setImageUrl}
              helperText="https://..."
              label='Image URL'
              small={true}
              type='text'
            />
          </div>

          {/* Confirmation checkbox */}
          <div className="p-4 mt-4 flex items-center gap-4 mb-4 font-medium text-sm animate-fadeIn">
            <label className="inline-flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="opacity-0 absolute h-0 w-0 peer"
                  checked={confirmed}
                  onChange={() => setConfirmed(!confirmed)}
                />
                <div className="bg-slate-100 dark:bg-zinc-900 rounded-md w-6 h-6 border peer-checked:bg-blue-700 border-blue-700 dark:border-blue-600 flex items-center justify-center">
                  {confirmed && (
                    <TickIcon className="fill-brandLight w-4 h-4 stroke-[3px] stroke-brandLight" />
                  )}
                </div>
              </div>
            </label>
            <p>I confirm that I have triple-checked the information above and understand that, should the token details need to be updated in the future, the TibetSwap team needs to update the information manually.</p>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-2 px-4 rounded-xl font-normal transition-all duration-200 ${
              isFormValid && !isSubmitting
                ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Adding rCAT...' : 'Add rCAT'}
          </button>
        </div>
      </main>
  );
};

export default AddRcat; 