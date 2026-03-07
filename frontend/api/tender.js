const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL?.replace(/^['"]|['"]$/g, '');
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN?.replace(/^['"]|['"]$/g, '');

// helper to keep url consistent regardless of trailing slash
function normalizeUrl(url) {
  if (!url) return url;
  return url.replace(/\/+$/g, '');
}

async function upstashRequest(command, args = []) {
  const base = normalizeUrl(UPSTASH_URL);
  if (!base || !UPSTASH_TOKEN) {
    console.error('Missing Upstash credentials', { UPSTASH_URL, UPSTASH_TOKEN });
    throw new Error('Upstash environment variables are not set');
  }

  const redisCommand = [command.toUpperCase(), ...args];
  console.log('Upstash request', redisCommand);

  const response = await fetch(base, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(redisCommand),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Upstash response error', response.status, errText);
    throw new Error(`Upstash request failed: ${response.status} ${errText}`);
  }

  const data = await response.json();
  return data.result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Handler called for /api/tender');
  console.log('Upstash URL and token present?', !!UPSTASH_URL, !!UPSTASH_TOKEN);
  console.log('Request body:', req.body);

  try {
    const tender = req.body;
    
    // Basic validation
    if (!tender || typeof tender !== 'object') {
      return res.status(400).json({ error: 'Invalid tender data' });
    }

    // Get current tenders from Upstash
    const tendersJson = await upstashRequest('get', ['tenders']);
    let tenders = [];
    if (tendersJson) {
      try {
        tenders = JSON.parse(tendersJson);
        if (!Array.isArray(tenders)) {
          console.warn('Upstash tenders value not array, resetting', tenders);
          tenders = [];
        }
      } catch (e) {
        console.error('Error parsing tendersJson from Upstash:', tendersJson, e);
        tenders = [];
      }
    }
    tenders.push(tender);
    
    // Save back to Upstash
    await upstashRequest('set', ['tenders', JSON.stringify(tenders)]);
    
    res.status(200).json({ 
      message: 'Tender added successfully', 
      tenderId: tenders.length 
    });
  } catch (error) {
    console.error('Error in /api/tender handler', error);
    res.status(500).json({ error: error.message });
  }
}

// Export functions for use by generate-pdf endpoint
export async function getTenders() {
  try {
    const tendersJson = await upstashRequest('get', ['tenders']);
    if (!tendersJson) return [];
    try {
      const arr = JSON.parse(tendersJson);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      console.error('Error parsing tendersJson in getTenders:', tendersJson, e);
      return [];
    }
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
