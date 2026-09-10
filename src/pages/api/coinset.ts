import type { NextApiRequest, NextApiResponse } from 'next';

const COINSET_ORIGIN = 'https://api.coinset.org';

const ALLOWED_ENDPOINTS = new Set([
  'get_coin_records_by_hints',
  'get_coin_records_by_puzzle_hashes',
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const endpoint = req.body?.endpoint;
  const payload = req.body?.payload;
  if (typeof endpoint !== 'string' || !ALLOWED_ENDPOINTS.has(endpoint) || !payload || typeof payload !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid Coinset proxy request' });
  }

  try {
    const upstream = await fetch(`${COINSET_ORIGIN}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: error instanceof Error ? error.message : 'Coinset proxy failed',
    });
  }
}
