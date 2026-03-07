const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function upstashRequest(command, args = []) {
  const response = await fetch(`${UPSTASH_URL}/${command}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  const data = await response.json();
  return data.result;
}

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

    // Get current tenders from Upstash
    const tendersJson = await upstashRequest('get', ['tenders']);
    const tenders = tendersJson ? JSON.parse(tendersJson) : [];
    tenders.push(tender);
    
    // Save back to Upstash
    await upstashRequest('set', ['tenders', JSON.stringify(tenders)]);
    
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
  try {
    const tendersJson = await upstashRequest('get', ['tenders']);
    return tendersJson ? JSON.parse(tendersJson) : [];
  } catch (error) {
    console.error('Error getting tenders:', error);
    return [];
  }
}

export async function clearTenders() {
  try {
    await upstashRequest('del', ['tenders']);
  } catch (error) {
    console.error('Error clearing tenders:', error);
  }
}
