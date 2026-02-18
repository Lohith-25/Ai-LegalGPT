# Project Overview

**AI LegalGPT** is a production-ready full-stack web application providing AI-powered legal guidance for common legal issues in India.

## 📋 What's Included

### Backend (Node.js + Express + MongoDB)
- ✅ Express server with CORS support
- ✅ MongoDB integration with Mongoose
- ✅ Gemini AI API integration
- ✅ RESTful API endpoints
- ✅ Error handling middleware
- ✅ TypeScript configuration
- ✅ Legal prompt engineering for India-specific guidance

### Frontend (React + Vite + TypeScript)
- ✅ Modern React UI with Vite bundler
- ✅ ChatGPT-like interface
- ✅ Case type selector sidebar
- ✅ Responsive design with Tailwind CSS
- ✅ Multilingual support (English + regional languages)
- ✅ Real-time message display
- ✅ Error handling and loading states

### Features
- 🎯 **4 Case Types**: FIR, Consumer Complaint, Rental Dispute, Cyber Crime
- 🌍 **Multilingual Support**: English, Hindi, Tamil, Telugu, Kannada, Malayalam
- 📜 **Legal Guidance**: Step-by-step procedures, required documents, fees, timelines
- 💾 **Chat History**: Store and retrieve conversations with MongoDB
- ⚖️ **India-Specific**: Guidance tailored to Indian legal system
- 📱 **Responsive**: Works on desktop and mobile devices
- ⚠️ **Disclaimer**: Clear legal information vs. legal advice disclaimer

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16
- MongoDB (local or MongoDB Atlas)
- Google Gemini API Key

### Installation

1. **Install Dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

2. **Configure Environment**

Backend: Edit `backend/.env`
```env
MONGODB_URI=mongodb://localhost:27017/ai-legalgpt
GEMINI_API_KEY=your_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Frontend: Create `frontend/.env.local`
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start the Application**

**Option 1: Separate Terminals**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Option 2: Using Scripts**
```bash
# Windows
./start.bat

# macOS/Linux
./start.sh
```

4. **Open Browser**
Navigate to `http://localhost:5173`

## 📁 Project Structure

```
ai-legalgpt/
├── backend/                          # Express server
│   ├── src/
│   │   ├── app.ts                   # Main server file
│   │   ├── controllers/
│   │   │   ├── legalController.ts   # Legal query handler
│   │   │   └── chatHistoryController.ts
│   │   ├── routes/
│   │   │   ├── legalRoutes.ts       # /api/legal/*
│   │   │   └── chatHistoryRoutes.ts # /api/chat/*
│   │   ├── models/
│   │   │   └── Message.ts           # MongoDB schema
│   │   ├── services/
│   │   │   └── legalService.ts      # Gemini AI integration
│   │   ├── middleware/
│   │   │   └── errorHandler.ts      # Error handling
│   │   └── utils/
│   │       └── prompts.ts           # AI prompts
│   ├── .env.example                 # Environment template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                         # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatPage.tsx         # Main chat interface
│   │   │   ├── Sidebar.tsx          # Case selector
│   │   │   ├── Message.tsx
│   │   │   ├── ResponseDisplay.tsx  # Legal guidance display
│   │   │   ├── QueryForm.tsx        # Input form
│   │   │   └── Disclaimer.tsx
│   │   ├── pages/
│   │   │   └── ChatPage.tsx
│   │   ├── services/
│   │   │   └── api.ts              # API calls
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript types
│   │   ├── styles/
│   │   │   └── index.css           # Tailwind CSS
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── SETUP.md                         # Detailed setup guide
├── README.md                        # This file
└── .gitignore
```

## API Endpoints

### Legal Query
```
POST /api/legal/query

Request:
{
  "userId": "user123",
  "caseType": "FIR|Consumer Complaint|Rental Dispute|Cyber Crime",
  "location": "Mumbai, Maharashtra",
  "description": "Detailed description of issue",
  "language": "en|hi|ta|te|kn|ml"
}

Response:
{
  "success": true,
  "data": {
    "messageId": "msg123",
    "steps": ["Step 1", "Step 2", ...],
    "requiredDocuments": ["Doc 1", "Doc 2", ...],
    "estimatedFees": "0-10000 INR",
    "timeline": "2-6 months",
    "disclaimer": "⚠️ This is legal information...",
    "clarifyingQuestions": ["Question 1?"]
  }
}
```

### Chat History
```
GET /api/chat/history/:userId
DELETE /api/chat/history/:userId
```

## 🔧 Configuration

### MongoDB
- **Local**: Ensure `mongod` is running on localhost:27017
- **Atlas**: Get connection string from MongoDB Atlas and update `MONGODB_URI`

### Gemini API
1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Add to `backend/.env`

## 📝 Development

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

### Code Quality
```bash
# Lint backend
cd backend && npm run lint

# Lint frontend
cd frontend && npm run lint
```

## 🏗️ Architecture

- **Frontend → Backend**: Axios HTTP calls via `/api/*` endpoints
- **Backend → Database**: Mongoose ODM with MongoDB
- **Backend → AI**: Google Generative AI (Gemini) API
- **Data Flow**: User Input → API Processing → AI Generation → Response Storage → Display

## ⚠️ Important Notes

1. **Legal Disclaimer**: The app clearly states this is legal information, not legal advice
2. **Verification**: All responses are structured to prevent hallucinations
3. **Privacy**: Chat history stored in MongoDB
4. **Scalability**: Can be deployed to production servers

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh localhost:27017
```

### API Not Responding
- Check backend is running: `http://localhost:5000/api/health`
- Verify CORS is enabled
- Check console for errors

### Frontend Not Loading
- Verify frontend is running: `http://localhost:5173`
- Check browser console for errors
- Verify `VITE_API_URL` is correct

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Gemini API Docs](https://ai.google.dev/docs)

## 📄 License

MIT

## 🤝 Contributing

This is a template project. Feel free to extend with:
- More case types
- Additional languages
- Payment integration
- Lawyer referral system
- Document generation
- Email notifications
- User authentication

---

**Status**: ✅ Production-ready full-stack application
**Last Updated**: February 2026
