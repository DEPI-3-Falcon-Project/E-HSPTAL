@echo off
echo Starting Egyptian Hospital Finder Website...
echo.
echo Stopping any existing processes on port 3000...
netstat -ano | findstr :3000 >nul
if %errorlevel% == 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        taskkill /F /PID %%a >nul 2>&1
    )
)
echo.
echo Starting the website on port 3000...
cd client
set PORT=3000
npm start
pause













