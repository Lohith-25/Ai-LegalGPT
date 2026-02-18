# Complete Setup & Quick Start Guide

## ⚡ 5-Minute Quick Start

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally or MongoDB Atlas account
- Google Gemini API key

### Step 1: Setup Backend

```bash
cd backend

# Create .env file with:
MONGODB_URI=mongodb://localhost:27017/ai-legalgpt
GEMINI_API_KEY=your_actual_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 2: Setup Frontend

```bash
cd frontend

# .env.local should contain:
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Run Both Servers

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

### Step 4: Open Application
```
http://localhost:5173
```

---

## 🔧 Detailed Setup

### 1. MongoDB Setup

#### Option A: Local MongoDB
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Or run Docker
docker run -d -p 27017:27017 --name ai-legalgpt-mongo mongo

# Test connection
mongosh localhost:27017
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `MONGODB_URI` in `backend/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-legalgpt
```

### 2. Get Gemini API Key

1. Visit https://ai.google.dev/
2. Click "Get API Key"
3. Follow the prompts to create API key
4. Add to `backend/.env`:
```
GEMINI_API_KEY=your_key_here
```

### 3. Verify Installation

**Check Backend:**
```bash
curl http://localhost:5000/api/health
# Expected response: {"status":"Server is running",...}
```

**Check Frontend:**
Open http://localhost:5173 in browser

---

## 📂 File Organization

```
ai-legalgpt/
├── backend/                    # Express.js server
│   ├── src/
│   │   ├── app.ts             # Main server file
│   │   ├── controllers/        # Request handlers
│   │   ├── routes/            # API routes
│   │   ├── models/            # MongoDB schemas
│   │   ├── services/          # Business logic (AI integration)
│   │   ├── middleware/        # Express middleware
│   │   └── utils/             # Helper functions & prompts
│   ├── dist/                  # Compiled JavaScript
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── ChatPage.tsx      # Main container
│   │   │   ├── Sidebar.tsx       # Case type selector
│   │   │   ├── Message.tsx       # Message display
│   │   │   ├── QueryForm.tsx     # Input form
│   │   │   ├── ResponseDisplay.tsx # Result display
│   │   │   └── Disclaimer.tsx    # Legal disclaimer
│   │   ├── pages/             # Page-level components
│   │   ├── services/          # API integration
│   │   ├── types/             # TypeScript interfaces
│   │   ├── styles/            # CSS + Tailwind
│   │   ├── hooks/             # Custom React hooks
│   │   ├── App.tsx            # Root component
│   │   └── main.tsx           # Entry point
│   ├── dist/                  # Production build output
│   ├── .env.local             # Environment variables
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── SETUP.md
├── IMPLEMENTATION.md
├── README.md
└── start.bat / start.sh
```

---

## 🔌 API Reference

### Submit Legal Query
```
POST /api/legal/query

Request Body:
{
  "userId": "user-123",
  "caseType": "FIR" | "Consumer Complaint" | "Rental Dispute" | "Cyber Crime",
  "location": "Mumbai, Maharashtra",
  "description": "I was arrested for...",
  "language": "en" | "hi" | "ta" | "te" | "kn" | "ml"
}

Response:
{
  "success": true,
  "data": {
    "messageId": "msg-456",
    "steps": [
      "Step 1: Go to local police station",
      "Step 2: File FIR with details",
      ...
    ],
    "requiredDocuments": [
      "Photo ID",
      "Address Proof",
      "Supporting evidence"
    ],
    "estimatedFees": "0 (Free for FIR)",
    "timeline": "Filed within 24 hours",
    "disclaimer": "⚠️ This is legal information...",
    "clarifyingQuestions": [
      "What type of crime?",
      "When did it happen?"
    ]
  }
}
```

### Get Chat History
```
GET /api/chat/history/:userId

Response:
{
  "success": true,
  "data": [...array of messages...],
  "count": 5
}
```

### Clear Chat History
```
DELETE /api/chat/history/:userId

Response:
{
  "success": true,
  "message": "Deleted 5 messages"
}
```

---

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
```bash
cd backend
npm run build
npm start
```

Environment variables needed:
- `MONGODB_URI`
- `GEMINI_API_KEY`
- `PORT`
- `NODE_ENV=production`
- `FRONTEND_URL=https://your-frontend-domain.com`

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

Environment variables needed:
- `VITE_API_URL=https://your-backend-api.com/api`

---

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Test legal query
curl -X POST http://localhost:5000/api/legal/query \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "caseType": "FIR",
    "location": "Delhi",
    "description": "I want to file an FIR for theft",
    "language": "en"
  }'
```

### Test Frontend
- Open http://localhost:5173
- Select a case type from sidebar
- Enter location and describe the issue
- Submit and verify the response

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB
```bash
# macOS: brew services start mongodb-community
# Docker: docker run -d -p 27017:27017 mongo
# Or check MongoDB Atlas connection string
```

### Gemini API Error
```
Error: 401 Unauthorized
```
**Solution:** 
- Verify API key is correct in `.env`
- Check API key has permission
- Ensure key is from Google AI Studio, not GCP

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### CORS Error in Browser
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:**
- Check `FRONTEND_URL` in backend `.env`
- Ensure backend is running
- Check network tab in DevTools

---

## 📊 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18.2.0 |
| | Vite | 5.0.8 |
| | TypeScript | 5.3.3 |
| | Tailwind CSS | 3.3.6 |
| **Backend** | Node.js | 16+ |
| | Express | 4.18.2 |
| | TypeScript | 5.3.3 |
| | MongoDB | 6.0+ |
| | Mongoose | 8.0.0 |
| **AI** | Google Gemini | Latest |
| **Tools** | Vite | 5.0.8 |
| | ESLint | 8.54.0 |

---

## 📝 Environment Files

### backend/.env
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ai-legalgpt

# AI API
GEMINI_API_KEY=your_key_here

# Server
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### frontend/.env.local
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

---

## 🎯 Next Steps

1. **Customize Legal Content**
   - Edit `backend/src/utils/prompts.ts` to add case types or modify guidance
   - Adjust Indian law references as needed

2. **Add Authentication**
   - Integrate JWT for user authentication
   - Store user profiles in MongoDB

3. **Enhance UI**
   - Add more animations
   - Improve mobile responsiveness
   - Add dark mode

4. **Scale Features**
   - Add lawyer directory
   - Implement document templates
   - Add video consultation booking
   - Create payment integration

5. **Deployment**
   - Push to GitHub
   - Deploy backend (Render.com, Railway.app)
   - Deploy frontend (Vercel, Netlify)
   - Monitor with services like Sentry

---

## 📞 Support Resources

- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Gemini API**: https://ai.google.dev/docs
- **Vite Docs**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/

---

**Created**: February 2026  
**Status**: ✅ Production Ready
