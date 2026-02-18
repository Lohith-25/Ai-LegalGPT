@echo off
REM Windows batch script to start the full stack application
REM Prerequisites: Node.js and npm installed

echo.
echo 🚀 Starting AI LegalGPT Full Stack Application
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Start MongoDB (if using local MongoDB)
echo 📦 Checking MongoDB...
echo You can:
echo   1. Run MongoDB locally (mongod)
echo   2. Use MongoDB Atlas (cloud)
echo Press any key to continue...
pause

echo.
echo 📍 Backend URL: http://localhost:5000/api
echo 📍 Frontend URL: http://localhost:5173
echo.

REM Start Backend in new window
echo Starting Backend Server...
start "AI LegalGPT Backend" cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start Frontend in new window
echo Starting Frontend Server...
start "AI LegalGPT Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo 📋 Next steps:
echo   1. Open http://localhost:5173 in your browser
echo   2. Configure your Gemini API key in backend/.env
echo   3. Ensure MongoDB is running
echo.
echo Press any key to close this window...
pause
