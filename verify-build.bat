@echo off
echo 🔍 Verifying SpotiLite build process step by step...

echo.
echo 📋 Step 1: Check current directory
echo Current directory: %CD%
dir

echo.
echo 📋 Step 2: Check package.json
if exist "package.json" (
    echo ✅ package.json found
    type package.json
) else (
    echo ❌ package.json not found
    exit /b 1
)

echo.
echo 📋 Step 3: Check if node_modules exists
if exist "node_modules" (
    echo ✅ node_modules found
    echo Removing old node_modules...
    rmdir /s /q node_modules
) else (
    echo ℹ️ node_modules not found (will be created)
)

echo.
echo 📋 Step 4: Install dependencies
echo Running: npm install
call npm install

echo.
echo 📋 Step 5: Check if vite is available
echo Running: npx vite --version
call npx vite --version

echo.
echo 📋 Step 6: Check package-lock.json
if exist "package-lock.json" (
    echo ✅ package-lock.json found
) else (
    echo ❌ package-lock.json not found
)

echo.
echo 📋 Step 7: Test build
echo Running: npm run build
call npm run build

echo.
echo 📋 Step 8: Check build output
if exist "dist\index.html" (
    echo ✅ Build successful! dist\index.html found
    echo 📁 dist directory contents:
    dir dist
) else (
    echo ❌ Build failed! dist\index.html not found
)

echo.
echo 🎯 Verification complete!
pause
