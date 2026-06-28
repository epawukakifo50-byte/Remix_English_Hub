@echo off
set "SCRIPT_DIR=%~dp0"
set "TARGET_BAT=%SCRIPT_DIR%Start_English_Hub.bat"
set "SHORTCUT=%USERPROFILE%\Desktop\English Hub.lnk"
set "ICON_PATH=%SCRIPT_DIR%icon.ico"

echo Creating shortcut on your Desktop...

powershell -Command "$wshell = New-Object -ComObject WScript.Shell; $shortcut = $wshell.CreateShortcut('%SHORTCUT%'); $shortcut.TargetPath = '%TARGET_BAT%'; $shortcut.WorkingDirectory = '%SCRIPT_DIR%'; if (Test-Path '%ICON_PATH%') { $shortcut.IconLocation = '%ICON_PATH%' }; $shortcut.Save()"

echo.
echo Shortcut created on your Desktop!
echo.
echo NOTE: To see your custom icon on the shortcut, you must place your image as an "icon.ico" file in this folder (%SCRIPT_DIR%) and run this script again. 
pause
