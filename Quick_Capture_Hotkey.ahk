; English Hub - Quick Capture Hotkey Script (AutoHotkey v2.0)
; This script opens the Quick Capture window when you press Ctrl+Shift+E
; Download and install AutoHotkey v2 (https://www.autohotkey.com/) to run this.

#Requires AutoHotkey v2.0

^+e::
{
    ; ^+e means Ctrl + Shift + E
    ; Width matching the max-w-lg container (512px) and height
    Width := 512
    Height := 680
    
    ; Calculate center position upfront
    X := Round((A_ScreenWidth - Width) / 2)
    Y := Round((A_ScreenHeight - Height) / 2)
    
    ; Run Chrome in app mode (no address bar) with position and size
    Run 'chrome.exe --app="http://localhost:3000/?mode=capture" --window-size=' Width ',' Height ' --window-position=' X ',' Y
    
    ; Wait for the Quick Capture window to appear (timeout 3 seconds)
    if WinWait("Quick Capture", , 3)
    {
        ; Force the window out of maximized state in case Chrome inherited it
        WinRestore "Quick Capture"
        Sleep 50
        
        ; Remove the title bar completely (WS_CAPTION = 0x00C00000)
        WinSetStyle "-0x00C00000", "Quick Capture"
        
        ; Re-apply exact size and position after removing title bar
        WinMove X, Y, Width, Height, "Quick Capture"
        
        ; Apply a rounded corner clipping region (radius 40px)
        WinSetRegion "0-0 w" Width " h" Height " R40-40", "Quick Capture"
    }
}
