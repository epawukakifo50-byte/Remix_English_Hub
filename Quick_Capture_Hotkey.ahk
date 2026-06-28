; English Hub - Quick Capture Hotkey Script (AutoHotkey v2.0)
; This script opens the Quick Capture window when you press Ctrl+Shift+E
; Download and install AutoHotkey v2 (https://www.autohotkey.com/) to run this.

#Requires AutoHotkey v2.0

^+e::
{
    ; ^+e means Ctrl + Shift + E
    ; Width and height exactly matching the max-w-lg container plus some margin
    Width := 530
    Height := 620
    
    ; Run Chrome in app mode (no address bar)
    Run 'chrome.exe --app="http://localhost:3000/?mode=capture" --window-size=' Width ',' Height
    
    ; Wait for the Quick Capture window to appear (timeout 3 seconds)
    if WinWait("Quick Capture", , 3)
    {
        ; Force the window out of maximized state in case Chrome inherited it
        WinRestore "Quick Capture"
        Sleep 100
        
        ; Center the window on the screen
        X := Round((A_ScreenWidth - Width) / 2)
        Y := Round((A_ScreenHeight - Height) / 2)
        WinMove X, Y, Width, Height, "Quick Capture"
    }
}
