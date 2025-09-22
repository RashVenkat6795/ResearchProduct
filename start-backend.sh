#!/bin/bash

# Amazon Scraper Backend Startup Script
echo "🚀 Starting Amazon Scraper Backend v2..."

# Navigate to backend directory
cd amazon-scraper-v2

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 not found. Installing PM2 globally..."
    npm install -g pm2
fi

# Stop any existing processes
echo "🛑 Stopping any existing processes..."
npm run pm2:stop 2>/dev/null || true
pkill -f "node server.js" 2>/dev/null || true

# Start the server with PM2
echo "▶️  Starting server with PM2..."
npm run pm2:start

# Wait a moment for startup
sleep 3

# Check status
echo "📊 Server Status:"
npm run pm2:status

# Test the API
echo "🧪 Testing API health..."
curl -s http://localhost:3001/api/health | jq '.' 2>/dev/null || curl -s http://localhost:3001/api/health

echo ""
echo "✅ Backend server is now running!"
echo "🌐 API Base URL: http://localhost:3001"
echo "📋 Available endpoints:"
echo "   - GET /api/health - Health check"
echo "   - GET /api/scrape?category=electronics - Scrape products"
echo "   - GET /api/categories - Get categories"
echo ""
echo "🔧 Management commands:"
echo "   - View logs: cd amazon-scraper-v2 && npm run pm2:logs"
echo "   - Stop server: cd amazon-scraper-v2 && npm run pm2:stop"
echo "   - Restart server: cd amazon-scraper-v2 && npm run pm2:restart"
