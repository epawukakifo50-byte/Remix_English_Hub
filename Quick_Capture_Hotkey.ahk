; English Hub - Quick Capture Hotkey Script (AutoHotkey v2.0)
; This script opens the Quick Capture window when you press Ctrl+Shift+E
; Download and install AutoHotkey v2 (https://www.autohotkey.com/) to run this.

#Requires AutoHotkey v2.0

^+e::
{
    ; ^+e means Ctrl + Shift + E
    ; Calculate width as 30% of screen width, height as 60% of screen height
    Width := Round(A_ScreenWidth * 0.30)
    Height := Round(A_ScreenHeight * 0.60)
    
    ; Change "chrome.exe" to "msedge.exe" if you use Edge
    Run 'chrome.exe --app="http://localhost:3000/?mode=capture" --window-size=' Width ',' Height
}
