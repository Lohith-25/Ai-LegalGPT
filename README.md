# AI LegalGPT - Full Stack Legal Assistant Application

A production-ready web application providing AI-powered legal guidance for common legal issues in India.

## Features

- **Chat Interface**: Interactive chat-like experience similar to ChatGPT
- **Case Type Selection**: Support for FIR, Consumer Complaint, Rental Dispute, Cyber Crime
- **Step-by-Step Guidance**: Procedural steps and legal information
- **Document Checklists**: Required documents and estimated timeline
- **Multilingual Support**: English + Regional languages
- **Chat History**: Store and retrieve previous conversations
- **Legal Disclaimer**: Clear disclaimer that this is information, not advice

## Project Structure

```
ai-legalgpt/
├── backend/          # Node.js + Express server
├── frontend/         # React + Vite client
└── README.md
```

## Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure .env with MongoDB URI and API keys
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `GEMINI_API_KEY`: Google Gemini API key
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### Frontend (.env.local)
- `VITE_API_URL`: Backend API URL

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS

## License

MIT

Done By Lohit