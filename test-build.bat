@echo off
echo 🧪 Testing SpotiLite build process locally...

REM Clean previous build
if exist "dist" (
    echo 🗑️ Removing previous build...
    rmdir /s /q dist
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Test build
echo 🏗️ Testing build...
call npm run build

REM Check if build succeeded
if exist "dist\index.html" (
    echo ✅ Build test successful!
    echo 📁 Output directory: dist/
    echo 🌐 You can test with: npm run preview
) else (
    echo ❌ Build test failed!
    echo Please check the error messages above.
)

pause
