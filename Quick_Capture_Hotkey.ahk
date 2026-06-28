; English Hub - Quick Capture Hotkey Script (AutoHotkey v2.0)
; This script opens the Quick Capture window when you press Ctrl+Shift+E
; Download and install AutoHotkey v2 (https://www.autohotkey.com/) to run this.

#Requires AutoHotkey v2.0

^+e::
{
    ; ^+e means Ctrl + Shift + E
    ; Change "chrome.exe" to "msedge.exe" if you use Edge
    Run 'chrome.exe --app="http://localhost:3000/?mode=capture" --window-size=400,600'
}
