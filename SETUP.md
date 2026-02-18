# Installation & Setup Guide

## Prerequisites

- Node.js >= 16
- MongoDB (local or Atlas)
- Google Gemini API Key (or OpenAI API Key)

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/ai-legalgpt
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ai-legalgpt
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## MongoDB Setup

### Option A: Local MongoDB

```bash
# On Windows (if installed)
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### Option B: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

## API Keys

### Get Gemini API Key

1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Create a new API key in Google Cloud Console
4. Add to `.env`

### Alternative: OpenAI API

To use OpenAI instead, modify `backend/src/services/legalService.ts` and install:
```bash
npm install openai
```

## Project Structure

```
ai-legalgpt/
├── backend/
│   ├── src/
│   │   ├── app.ts              # Express server entry
│   │   ├── controllers/        # Request handlers
│   │   ├── routes/             # API routes
│   │   ├── models/             # MongoDB schemas
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Custom middleware
│   │   └── utils/              # Helpers
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API calls
│   │   ├── hooks/              # Custom hooks
│   │   ├── types/              # TypeScript types
│   │   ├── styles/             # CSS
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## API Endpoints

### POST /api/legal/query
Submit a legal query

**Request:**
```json
{
  "userId": "user-id",
  "caseType": "FIR|Consumer Complaint|Rental Dispute|Cyber Crime",
  "location": "City, State",
  "description": "Detailed description",
  "language": "en|hi|ta|te|kn|ml"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "msg-id",
    "steps": [...],
    "requiredDocuments": [...],
    "estimatedFees": "Amount",
    "timeline": "Timeline",
    "disclaimer": "Warning text"
  }
}
```

### GET /api/chat/history/:userId
Get chat history

### DELETE /api/chat/history/:userId
Clear chat history

## Development

### Run Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Build for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or Docker container
- Check `MONGODB_URI` in `.env`
- Try: `mongosh localhost:27017` to test connection

### Gemini API Error
- Verify API key is valid and has permissions
- Check rate limits
- Try: `curl https://generativelanguage.googleapis.com/v1/models?key=YOUR_KEY`

### Backend not connecting to Frontend
- Check `FRONTEND_URL` in backend `.env`
- Verify CORS is enabled
- Frontend should use `VITE_API_URL` correctly

### Port Already in Use
- Backend (5000): `lsof -i :5000` (macOS/Linux) or `netstat -ano | findstr :5000` (Windows)
- Frontend (5173): `lsof -i :5173` or `netstat -ano | findstr :5173`
- Kill process and restart

## Next Steps

1. Configure `.env` files
2. Ensure MongoDB is running
3. Start backend with `npm run dev`
4. Start frontend with `npm run dev`
5. Open `http://localhost:5173` in browser
6. Test with a sample query

## Support

For issues or questions, check:
- Backend logs in terminal
- Browser console (F12)
- Network tab in DevTools
- Check MongoDB connection
- Verify API keys
