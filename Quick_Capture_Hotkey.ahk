; English Hub - Quick Capture Hotkey Script (AutoHotkey v2.0)
; This script opens the Quick Capture window when you press Ctrl+Shift+E
; Download and install AutoHotkey v2 (https://www.autohotkey.com/) to run this.

#Requires AutoHotkey v2.0

^+e::
{
    ; ^+e means Ctrl + Shift + E
    ; Width matching the max-w-lg container (512px) and height
    Width := 512
    Height := 620
    
    ; Run Chrome in app mode (no address bar)
    Run 'chrome.exe --app="http://localhost:3000/?mode=capture" --window-size=' Width ',' Height
    
    ; Wait for the Quick Capture window to appear (timeout 10 seconds)
    SetTitleMatchMode 2
    if WinWait("Quick Capture", , 10)
    {
        ; Force the window out of maximized state in case Chrome inherited it
        WinRestore "Quick Capture"
        Sleep 500 ; Wait for Chrome to fully render the window frame
        
        ; Remove the title bar completely (WS_CAPTION = 0xC00000)
        ; Also remove borders (WS_BORDER = 0x800000, WS_SIZEBOX = 0x40000)
        WinSetStyle "-0xC00000", "Quick Capture"
        WinSetStyle "-0x800000", "Quick Capture"
        WinSetStyle "-0x40000", "Quick Capture"
        
        ; Center the window on the screen
        X := Round((A_ScreenWidth - Width) / 2)
        Y := Round((A_ScreenHeight - Height) / 2)
        WinMove X, Y, Width, Height, "Quick Capture"
    }
}
