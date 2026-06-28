@echo off
echo Starting English Hub Server...
echo Make sure you have installed Node.js!
echo.

:: Check if node_modules exists, if not run npm install
IF NOT EXIST "node_modules\" (
    echo Installing dependencies for the first time...
    call npm install
)

echo.
echo Starting the local server...
start cmd /k "npm run dev"

echo Waiting for server to start...
timeout /t 3 /nobreak > NUL

echo Opening English Hub Dashboard...
start chrome --app="http://localhost:3000"

echo Launching Quick Capture Hotkey...
start Quick_Capture_Hotkey.ahk

exit
