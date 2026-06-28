@echo off
echo ==============================================
echo English Hub - Update System
echo ==============================================
echo.
echo Pulling latest changes from GitHub...
git pull

echo.
echo Installing any new dependencies...
call npm install

echo.
echo Update complete!
echo You can now start the application with Start_English_Hub.bat
echo.
pause
