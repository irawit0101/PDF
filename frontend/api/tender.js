import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tender = req.body;

    // Basic validation
    if (!tender || typeof tender !== 'object') {
      return res.status(400).json({ error: 'Invalid tender data' });
    }

    // Get current tenders from KV
    const tenders = (await kv.get('tenders')) || [];
    tenders.push(tender);

    // Save back to KV
    await kv.set('tenders', tenders);

    res.status(200).json({
      message: 'Tender added successfully',
      tenderId: tenders.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Export functions for use by generate-pdf endpoint
export async function getTenders() {
  return (await kv.get('tenders')) || [];
}

export async function clearTenders() {
  await kv.set('tenders', []);
}
