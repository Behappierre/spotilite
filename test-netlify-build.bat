@echo off
echo 🚀 Testing Netlify Build Process...

echo.
echo 📋 Step 1: Checking build command...
echo Command: npm ci && npm run build
echo.

echo 📦 Step 2: Installing dependencies (simulating npm ci)...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo.
echo 🔨 Step 3: Running build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ npm run build failed
    pause
    exit /b 1
)

echo.
echo 📁 Step 4: Checking build output...
if exist "dist\index.html" (
    echo ✅ dist/index.html exists
) else (
    echo ❌ dist/index.html missing
    pause
    exit /b 1
)

if exist "dist\assets\*.js" (
    echo ✅ JavaScript assets exist
) else (
    echo ❌ JavaScript assets missing
    pause
    exit /b 1
)

echo.
echo 🎯 Step 5: Analyzing build output...
for %%f in (dist\*.html) do echo - %%f
for %%f in (dist\assets\*.js) do echo - %%f

echo.
echo ✅ SUCCESS: Build process matches Netlify requirements!
echo.
echo 📝 Summary:
echo ✅ TypeScript compilation works via Vite
echo ✅ Production build generates optimized assets
echo ✅ All required files present in dist/ folder
echo ✅ Build command: npm ci && npm run build
echo ✅ Publish directory: dist
echo.
echo 🚀 Ready for Netlify deployment!
echo.
pause
