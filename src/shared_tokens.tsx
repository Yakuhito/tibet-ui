import { Pair, Token } from "./api"

export const XCH: Token = {
    asset_id: '',
    hidden_puzzle_hash: null,
    name: 'Chia',
    short_name: process.env.NEXT_PUBLIC_XCH || 'XCH',
    image_url: '/assets/xch.webp',
    verified: true
}

export const UNKNWN: Token = {
  asset_id: '',
  hidden_puzzle_hash: null,
  name: 'Unknown Token',
  short_name: '???',
  image_url: 'https://bafybeigzcazxeu7epmm4vtkuadrvysv74lbzzbl2evphtae6k57yhgynp4.ipfs.dweb.link/9098.gif',
  verified: false
}

export function getLiquidityToken(pair: Pair | null, token: Token | null): Token {
  let shortName = `TIBET-${token?.short_name ?? 'XXX'}-${process.env.NEXT_PUBLIC_XCH}`;
  if (pair?.asset_hidden_puzzle_hash && pair?.inverse_fee !== 999) {
    shortName = `TIBET-${pair?.inverse_fee}-${token?.short_name ?? 'XXX'}-${process.env.NEXT_PUBLIC_XCH}`;
  }
  return {
    asset_id: pair?.liquidity_asset_id ?? '',
    hidden_puzzle_hash: null,
    name: 'Pair Liquidity Token',
    short_name: shortName,
    image_url: '/logo.jpg',
    verified: true
  }
}