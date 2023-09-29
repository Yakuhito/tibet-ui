  // Models
  export interface Router {
    launcher_id: string;
    current_coin_id: string;
    network: string;
  }
  
  export interface Pair {
    launcher_id: string;
    name: string;
    short_name: string;
    image_url: string;
    asset_id: string;
    current_coin_id: string;
    xch_reserve: number;
    token_reserve: number;
    liquidity: number;
    trade_volume: number;
  }

  export interface StateChange {
    xch: number;
    token: number;
    liquidity: number;
  }
  
  export interface Transaction {
    coin_id: string;
    pair_launcher_id: string;
    operation: "REMOVE_LIQUIDITY" | "SWAP" | "ADD_LIQUIDITY";
    state_change: StateChange;
    height: number;
    timestamp: number;
  }

  export interface Stats {
    transaction_count: number;
    total_value_locked: number;
    total_trade_volume: number;
  }
  
  // API Functions
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  export async function getRouter(): Promise<Router> {
    const response = await fetch(`${API_BASE_URL}/router`);
    return response.json();
  }
  
  export async function getPairs(): Promise<Pair[]> {
    const response = await fetch(`${API_BASE_URL}/pairs`);
    return response.json();
  }
  
  export async function getTransactions(
    pairLauncherId: string,
    limit: number = 42,
    offset: number = 0
  ): Promise<Transaction[]> {
    const response = await fetch(
      `${API_BASE_URL}/transactions?pair_launcher_id=${pairLauncherId}&limit=${limit}&offset=${offset}`
    );
    return response.json();
  }

  export async function getPair(
    pairLauncherId: string
  ): Promise<Pair> {
    const response = await fetch(
      `${API_BASE_URL}/pair/${pairLauncherId}`
    );
    return response.json();
  }
  
  
  export async function getStats(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return response.json();
  }
  