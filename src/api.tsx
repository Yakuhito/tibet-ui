import { bech32m } from 'bech32';
import axios from 'axios';

// Token model
export interface Token {
    asset_id: string;
    pair_id: string;
    name: string;
    short_name: string;
    image_url: string;
    verified: boolean;
}
  
// Pair model
export interface Pair {
    launcher_id: string;
    asset_id: string;
    liquidity_asset_id: string;
    xch_reserve: number;
    token_reserve: number;
    liquidity: number;
    last_coin_id_on_chain: string;
}

// Enum for ActionType
export enum ActionType {
    SWAP = "SWAP",
    ADD_LIQUIDITY = "ADD_LIQUIDITY",
    REMOVE_LIQUIDITY = "REMOVE_LIQUIDITY",
}
  
// Model for Quote
export interface Quote {
    amount_in: number;
    amount_out: number;
    price_warning: boolean;
    fee: number;
    asset_id: string;
    input_reserve: number;
    output_reserve: number;
}
  
// Model for OfferResponse
export interface OfferResponse {
    success: boolean;
    message: string;
    offer_id: string;
}

// Model for CreatePairResponse
export interface CreatePairResponse {
    success: boolean;
    message: string;
    coin_id: string;
}  

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; 

// Function to get all tokens
export async function getAllTokens(): Promise<Token[]> {
  const response = await axios.get<Token[]>(`${BASE_URL}/tokens`);
  return response.data;
}

// Function to get all pairs
export async function getAllPairs(skip: number = 0, limit: number = 10): Promise<Pair[]> {
  const response = await axios.get<Pair[]>(`${BASE_URL}/pairs`, {
    params: { skip, limit },
  });
  return response.data;
}

// Function to get a token by asset_id
export async function getTokenByAssetId(assetId: string): Promise<Token> {
  const response = await axios.get<Token>(`${BASE_URL}/token/${assetId}`);
  return response.data;
}

// Function to get a pair by launcher_id
export async function getPairByLauncherId(launcherId: string): Promise<Pair> {
  const response = await axios.get<Pair>(`${BASE_URL}/pair/${launcherId}`);
  return response.data;
}

// Function to get a quote for a pair
export async function getQuoteForPair(pairId: string, amountIn?: number, amountOut?: number, xchIsInput?: boolean, estimateFee?: boolean): Promise<Quote> {
  const response = await axios.get<Quote>(`${BASE_URL}/quote/${pairId}`, {
    params: { amount_in: amountIn, amount_out: amountOut, xch_is_input: xchIsInput, estimate_fee: estimateFee },
  });
  return response.data;
}

// Function to create an offer for a pair
export async function createOfferForPair(
  pairId: string,
   offer: string,
   action: ActionType,
   devFee: number,
): Promise<OfferResponse> {
  const requestBody = {
    offer,
    action,
    total_donation_amount: devFee,
    donation_addresses: [process.env.NEXT_PUBLIC_DONATION_ADDRESS],
    donation_weights: [1]
  };
  const response = await axios.post<OfferResponse>(`${BASE_URL}/offer/${pairId}`, requestBody);
  return response.data;
}

// Function to create pair
export async function createPair(
   assetId: string,
   offer: string,
   xch_liquidity: number,
   token_liquidity: number,
   liquidity_destination_address: string,
): Promise<CreatePairResponse> {
  const requestBody = {
    offer,
    xch_liquidity,
    token_liquidity,
    liquidity_destination_address
  };
  const response = await axios.post<CreatePairResponse>(`${BASE_URL}/pair/${assetId}`, requestBody);
  return response.data;
}

export async function refreshRouter(): Promise<void> {
 await axios.post<void>(`${BASE_URL}/router`, {});
}

// Function to create pair
export async function isCoinSpent(
  coinId: string,
): Promise<boolean> {
 const response: any = await axios.post<any>(process.env.NEXT_PUBLIC_XCH === "XCH" ? "https://api.coinset.org/get_coin_record_by_name" : "https://testnet11.api.coinset.org/get_coin_record_by_name", {name: "0x" + coinId});
 return response.data.success;
}

export function getInputPrice(input_amount: number, input_reserve: number, output_reserve: number): number {
  if(input_amount == 0) return 0;

  const input_amount_with_fee = input_amount * 993;
  const numerator = input_amount_with_fee * output_reserve;
  const denominator = (input_reserve * 1000) + input_amount_with_fee;
  return Math.floor(numerator / denominator);
}

export function getOutputPrice(output_amount: number, input_reserve: number, output_reserve: number): number {
  if(output_amount > output_reserve) {
    return 0;
  }
  if(output_amount == 0) return 0;

  const numerator = input_reserve * output_amount * 1000;
  const denominator = (output_reserve - output_amount) * 993;
  return Math.floor(numerator / denominator) + 1;
}

export function getFastQuote(
  amountIn: number | undefined,
  amountOut: number | undefined,
  xchIsInput: boolean,
  xchReserve: number,
  tokenReserve: number
): number {
  if ((amountIn !== undefined && amountOut !== undefined) || (amountIn === undefined && amountOut === undefined)) {
    throw new Error('Exactly one of amountIn or amountOut must be set');
  }
  if (xchReserve <= 0 || tokenReserve <= 0) {
    throw new Error('Reserves must be positive');
  }
  
  var inputReserve: number = xchReserve;
  var outputReserve: number = tokenReserve;
  if(!xchIsInput) {
    inputReserve = tokenReserve;
    outputReserve = xchReserve;
  }

  if(amountOut === undefined) {
    return getInputPrice(amountIn!, inputReserve, outputReserve)
  }

  return getOutputPrice(amountOut!, inputReserve, outputReserve)
}

export function getLiquidityQuote(
  knownIn: number,
  knownReserve: number,
  unknownReserve: number,
  checkUnknown: boolean
): number {
  if(knownReserve === 0 || unknownReserve === 0 || knownIn === 0) return 0;
  const output = Math.floor(unknownReserve * knownIn / knownReserve);
  
  if(checkUnknown && output > unknownReserve) return 0;
  return output;
}

// CNS Integration
interface CNSApiResponse {
  answers: Answer[];
}

interface Answer {
  name: string;
  type: string;
  time_to_live: number;
  data: string;
  proof_coin_name: string;
  proof_coin_spent_index: number;
  nft_coin_name: string;
}

export async function getCNSNameApiCall(address: string) {
  if (!address) return null;
  const decodedAddr = Buffer.from(
    bech32m.fromWords(bech32m.decode(address).words)
  ).toString("hex");

  const url = 'https://walletapi.chiabee.net/Name/resolve';
  const data = {
    queries: [
      {
        name: decodedAddr,
        type: "name"
      }
    ]
  };

  const res = await axios.post<CNSApiResponse>(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!res.data.answers.length) {
    return '';
  }

  return res.data.answers[0].name;
}