@echo off
echo 🧪 Testing simple build process...

REM Clean previous build
if exist "dist" (
    echo 🗑️ Removing previous build...
    rmdir /s /q dist
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Test direct vite build
echo 🏗️ Testing direct vite build...
call npx vite build

REM Check if build succeeded
if exist "dist\index.html" (
    echo ✅ Build test successful!
    echo 📁 Output directory: dist/
) else (
    echo ❌ Build test failed!
    echo Please check the error messages above.
)

pause
