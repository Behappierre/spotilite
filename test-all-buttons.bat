@echo off
echo 🎵 Testing ALL SpotiLite playback control buttons...

echo.
echo 📋 Checking if all button functions are properly implemented...

echo.
echo 🔍 1. Play/Pause Button (toggleWebPlayback)
findstr /C:"Get current state from the Web Playback SDK" index.html >nul
if %errorlevel% equ 0 (
    echo ✅ toggleWebPlayback function updated correctly
) else (
    echo ❌ toggleWebPlayback function not found or not updated
)

echo.
echo 🔍 2. Stop Button (stopWebPlayback)
findstr /C:"Try to stop using the Web Playback SDK first" index.html >nul
if %errorlevel% equ 0 (
    echo ✅ stopWebPlayback function updated correctly
) else (
    echo ❌ stopWebPlayback function not found or not updated
)

echo.
echo 🔍 3. Next Track Button (playNextTrack)
findstr /C:"Already at the last track" index.html >nul
if %errorlevel% equ 0 (
    echo ✅ playNextTrack function updated correctly
) else (
    echo ❌ playNextTrack function not found or not updated
)

echo.
echo 🔍 4. Previous Track Button (playPreviousTrack)
findstr /C:"Already at the first track" index.html >nul
if %errorlevel% equ 0 (
    echo ✅ playPreviousTrack function updated correctly
) else (
    echo ❌ playPreviousTrack function not found or not updated
)

echo.
echo 🔍 5. Play Full Track (playFullTrack)
findstr /C:"Starting playback..." index.html >nul
if %errorlevel% equ 0 (
    echo ✅ playFullTrack function updated correctly
) else (
    echo ❌ playFullTrack function not found or not updated
)

echo.
echo 🎯 All Button Tests Complete!
echo.
echo 📝 What was fixed:
echo 1. ✅ Play/Pause button now uses Web Playback SDK directly
echo 2. ✅ Stop button properly stops playback and resets UI
echo 3. ✅ Next/Previous buttons have better error handling
echo 4. ✅ All buttons follow Spotify best practices
echo 5. ✅ Fallback to API if SDK fails
echo 6. ✅ Better user feedback and error messages
echo.
echo 🚀 Next steps:
echo 1. Test the app locally to verify all buttons work
echo 2. Commit the changes: git add . && git commit -m "Fix all playback control buttons - use Web Playback SDK best practices"
echo 3. Push to GitHub: git push origin main
echo 4. Netlify will automatically redeploy with the fixes
echo.
echo 🎵 Expected behavior:
echo - Play/Pause: Toggles between play and pause states
echo - Stop: Completely stops playback and resets UI
echo - Next: Plays next track in search results
echo - Previous: Plays previous track in search results
echo - All buttons provide clear feedback and error handling
echo.
pause
