#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting SpotiLite build process..."

# Check if we're on Netlify
if [ "$NETLIFY" = "true" ]; then
    echo "🌐 Detected Netlify environment"
    export NODE_ENV=production
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Verify Vite is available
echo "🔍 Verifying Vite installation..."
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found, trying alternative approach..."
    npm exec -- vite --version
else
    npx vite --version
fi

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Output directory: dist/"
