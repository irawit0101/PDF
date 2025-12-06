# Tender PDF Generator

A full-stack web application for generating PDF documents for tender submissions with price breakdowns.

## Features

- Form-based tender submission
- Multiple tender support with "Submit & Repeat" functionality
- Automatic price calculations
- PDF generation with detailed breakdowns
- Amount in words conversion
- Responsive UI with form validation

## Tech Stack

- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express
- PDF Generation: PDFKit
- Form Handling: React Hook Form + Zod
- Styling: TailwindCSS
- Notifications: React Hot Toast

## Project Structure

```
tender-pdf-generator/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── TenderForm.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── backend/                 # Node.js backend
    ├── src/
    │   ├── server.js
    │   └── pdfGenerator.js
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on http://localhost:3001

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on http://localhost:3000

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist` folder to Vercel or Netlify
3. Configure the backend URL in the environment variables

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Connect your repository to Render/Railway
3. Configure environment variables:
   - `PORT`: Port number for the server
   - `CORS_ORIGIN`: Frontend URL

## Environment Variables

### Backend
- `PORT`: Server port (default: 3001)
- `CORS_ORIGIN`: Allowed frontend origin

### Frontend
- `VITE_API_URL`: Backend API URL

## API Endpoints

- `POST /api/tender`: Submit a new tender
- `POST /api/generate-pdf`: Generate PDF for submitted tenders
- `GET /health`: Health check endpoint

## License

MIT