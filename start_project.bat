@echo off
echo Starting Database Health Monitor...

:: Start backend in a new terminal
start cmd /k "cd backend && python app.py"

:: Wait 2 seconds before starting frontend
timeout /t 2 > nul

:: Start frontend in a new terminal
start cmd /k "cd frontend && npm run dev"

:: Wait a few seconds to let frontend initialize
timeout /t 5 > nul

:: Open browser to the dashboard
start http://localhost:5173

echo All servers started and dashboard opened.
