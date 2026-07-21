@echo off
echo Stopping AI Dropout Prediction System processes...
echo ==================================================

echo Stopping Backend (Port 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /F /PID %%a 2>nul

echo Stopping Frontend (Port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /F /PID %%a 2>nul

echo Stopping AI Service (Port 8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /F /PID %%a 2>nul

echo.
echo All processes stopped gracefully.
