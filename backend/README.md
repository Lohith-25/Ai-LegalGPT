# AI LegalGPT Backend

Express.js backend server for the AI Legal Assistant application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables:
- `MONGODB_URI`: MongoDB connection string
- `GEMINI_API_KEY`: Google Gemini API key
- `PORT`: Server port (default: 5000)

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### POST /api/legal-query
Submit a legal query and receive AI-powered guidance.

**Request:**
```json
{
  "userId": "user123",
  "caseType": "FIR|Consumer Complaint|Rental Dispute|Cyber Crime",
  "location": "State/City",
  "description": "Detailed description of the issue",
  "language": "en|hi|ta|te|kn|ml"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "steps": ["Step 1", "Step 2", ...],
    "requiredDocuments": ["Doc 1", "Doc 2", ...],
    "estimatedFees": "Amount",
    "timeline": "Estimated timeline",
    "disclaimer": "Legal information, not advice"
  }
}
```

### GET /api/chat-history/:userId
Retrieve chat history for a user.

### POST /api/chat-history
Save a new chat message.

## Project Structure

```
src/
├── app.ts              # Express app setup
├── controllers/        # Request handlers
├── routes/             # API routes
├── models/             # MongoDB schemas
├── services/           # Business logic
├── middleware/         # Custom middleware
└── utils/              # Helper functions
```
