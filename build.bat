@echo off
echo 🚀 Starting SpotiLite build process...

REM Check if we're on Netlify
if "%NETLIFY%"=="true" (
    echo 🌐 Detected Netlify environment
    set NODE_ENV=production
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci --prefer-offline --no-audit

REM Verify Vite is available
echo 🔍 Verifying Vite installation...
call npx vite --version

REM Build the project
echo 🏗️ Building project...
call npm run build

echo ✅ Build completed successfully!
echo 📁 Output directory: dist/
