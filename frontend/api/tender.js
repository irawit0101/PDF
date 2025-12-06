// In-memory tender storage (not persistent across instances)
// For production, consider using a database or Vercel KV
let tenders = [];

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tender = req.body;
    
    // Basic validation
    if (!tender || typeof tender !== 'object') {
      return res.status(400).json({ error: 'Invalid tender data' });
    }

    tenders.push(tender);
    res.status(200).json({ 
      message: 'Tender added successfully', 
      tenderId: tenders.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Export tenders for use by generate-pdf endpoint
export function getTenders() {
  return tenders;
}

export function clearTenders() {
  tenders = [];
}
