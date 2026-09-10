import type { NextApiRequest, NextApiResponse } from 'next';

import { REFUNDS_CSV_URL } from '@/lib/refund/csv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const upstream = await fetch(REFUNDS_CSV_URL);
    if (!upstream.ok) {
      return res.status(upstream.status).send('Failed to load refunds CSV');
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).send(await upstream.text());
  } catch (error) {
    return res.status(502).send(error instanceof Error ? error.message : 'Refunds CSV proxy failed');
  }
}
