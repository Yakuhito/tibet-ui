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
}  

const BASE_URL = "https://api.v1-testnet10.tibetswap.io"; 

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
export async function createOfferForPair(pairId: string, offer: string, action: ActionType, returnAddress?: string): Promise<OfferResponse> {
  const requestBody = {
    offer,
    action,
    return_address: returnAddress || 'xch10d09t9eqpr2y34thcayk54sjz34qhyv3tmhrejjp6xxvj598sfds5z0xch',
  };
  const response = await axios.post<OfferResponse>(`${BASE_URL}/offer/${pairId}`, requestBody);
  return response.data;
}

