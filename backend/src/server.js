import express from 'express';
import cors from 'cors';
import { generatePDF } from './pdfGenerator.js';

const app = express();
const port = process.env.PORT || 4002;  // Using port 4002

// Handle server errors
process.on('uncaughtException', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('Uncaught Exception:', error);
  }
});

// Store tenders in memory (replace with database in production)
let tenders = [];

app.use(cors());
app.use(express.json());

// API endpoint to submit a tender
app.post('/api/tender', (req, res) => {
  try {
    const tender = req.body;
    tenders.push(tender);
    res.json({ message: 'Tender added successfully', tenderId: tenders.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to generate PDF
app.post('/api/generate-pdf', async (req, res) => {
  try {
    if (tenders.length === 0) {
      return res.status(400).json({ error: 'No tenders available' });
    }

    const pdfBuffer = await generatePDF(tenders);
    
    // Clear tenders after generating PDF
    tenders = [];

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=tenders.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});