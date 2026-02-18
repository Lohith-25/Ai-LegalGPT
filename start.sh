#!/bin/bash

echo "🚀 Starting AI LegalGPT Full Stack Application"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Start Backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo ""

# Wait a bit for backend to start
sleep 3

# Start Frontend
echo -e "${BLUE}Starting Frontend Server...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo ""

echo -e "${GREEN}"
echo "✅ AI LegalGPT is now running!"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend API: http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop both servers"
echo -e "${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
