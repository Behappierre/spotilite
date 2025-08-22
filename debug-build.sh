#!/bin/bash

# Exit on any error
set -e

echo "🔍 Debugging SpotiLite build process..."

echo "📁 Current directory: $(pwd)"
echo "👤 User: $(whoami)"
echo "🔧 Node version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

echo "📋 Directory contents:"
ls -la

echo "📦 Package.json contents:"
cat package.json

echo "🔍 Installing dependencies..."
npm install --production=false

echo "📋 Node modules contents:"
ls -la node_modules/

echo "🔍 Vite location:"
find node_modules -name "vite" -type f 2>/dev/null || echo "Vite not found in node_modules"

echo "🔍 NPM bin:"
npm bin

echo "🔍 Local npm packages:"
npm list --depth=0

echo "🏗️ Attempting build..."
npm run build

echo "📁 Checking build output..."
ls -la dist/ || echo "dist directory not found"

echo "✅ Debug complete!"
