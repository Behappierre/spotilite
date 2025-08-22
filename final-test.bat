@echo off
echo 🎯 Final SpotiLite build test - Terser issue fixed!

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🏗️ Building project...
call npm run build

echo.
echo 📁 Checking build output...
if exist "dist\index.html" (
    echo ✅ SUCCESS! Build completed successfully!
    echo 📁 dist directory contents:
    dir dist
    echo.
    echo 🎉 Your SpotiLite app is ready for Netlify deployment!
) else (
    echo ❌ Build failed! Please check the error messages above.
)

echo.
echo 🎯 Test complete!
pause
