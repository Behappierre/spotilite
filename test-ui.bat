@echo off
echo 🎵 Testing SpotiLite UI updates...

echo.
echo 📋 Checking if index.html has the new skip button icons...

findstr /C:"M6 6h2v12H6zm3.5 6l8.5 6V6z" index.html >nul
if %errorlevel% equ 0 (
    echo ✅ Previous track button icon updated correctly
) else (
    echo ❌ Previous track button icon not found
)

findstr /C:"M16 6h2v12h-2zm-3.5 6l-8.5 6V6z" index.html >nul
if %errorlevel% equ 0 (
    echo ✅ Next track button icon updated correctly
) else (
    echo ❌ Next track button icon not found
)

echo.
echo 🎯 UI test complete!
echo.
echo 📝 Next steps:
echo 1. Test the app locally to see the new button icons
echo 2. Commit the changes: git add . && git commit -m "Update skip button icons to standard Spotify style"
echo 3. Push to GitHub: git push origin main
echo 4. Netlify will automatically redeploy with the new icons
echo.
pause
