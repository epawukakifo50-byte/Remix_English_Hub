@echo off
echo Opening Quick Capture...

:: This uses Chrome's application mode to open a small, clean window without tabs or URL bar.
:: You can change "chrome" to "msedge" if you prefer Microsoft Edge.
start chrome --app="http://localhost:3000/?mode=capture" --window-size=400,600

exit
