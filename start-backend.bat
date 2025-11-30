@echo off
echo ========================================
echo    تشغيل الباك إند
echo ========================================
echo.
cd /d %~dp0\backend
npm run dev
pause

