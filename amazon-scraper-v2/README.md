# Amazon Scraper API v2

A robust Node.js backend service for scraping Amazon India bestsellers with improved process management using PM2.

## Features

- ✅ Real-time Amazon India bestsellers scraping
- ✅ PM2 process management for reliability
- ✅ Graceful error handling and fallback to mock data
- ✅ Multiple product category support
- ✅ RESTful API endpoints
- ✅ Comprehensive logging
- ✅ Auto-restart on crashes

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start with PM2 (Recommended)
```bash
npm run pm2:start
```

### 3. Check Status
```bash
npm run pm2:status
```

### 4. View Logs
```bash
npm run pm2:logs
```

## Available Scripts

- `npm start` - Start server directly
- `npm run pm2:start` - Start with PM2
- `npm run pm2:stop` - Stop PM2 process
- `npm run pm2:restart` - Restart PM2 process
- `npm run pm2:logs` - View PM2 logs
- `npm run pm2:status` - Check PM2 status

## API Endpoints

### Health Check
```
GET /api/health
```

### Scrape Products
```
GET /api/scrape?category=electronics
```

### Get Categories
```
GET /api/categories
```

## Environment Variables

Create a `.env` file:
```env
PORT=3001
NODE_ENV=development
SCRAPING_DELAY=1000
MAX_PRODUCTS=50
USER_AGENT_ROTATION=true
CORS_ORIGIN=http://localhost:5173
```

## Process Management

This server is designed to run with PM2 for production reliability:

- **Auto-restart**: Automatically restarts on crashes
- **Memory management**: Restarts if memory usage exceeds 1GB
- **Logging**: Comprehensive logging to files
- **Monitoring**: Built-in process monitoring

## Troubleshooting

### Server Not Starting
```bash
# Check PM2 status
npm run pm2:status

# View logs
npm run pm2:logs

# Restart if needed
npm run pm2:restart
```

### Port Already in Use
```bash
# Kill any existing processes
pkill -f "node server.js"

# Restart PM2
npm run pm2:restart
```

## Architecture

- **Express.js**: Web framework
- **Cheerio**: HTML parsing for web scraping
- **Axios**: HTTP client for web requests
- **PM2**: Process management and monitoring
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Configure proper CORS origins
3. Set up monitoring and alerting
4. Configure log rotation
5. Set up health checks

## Version History

- **v2.0.0**: Added PM2 process management, improved error handling
- **v1.0.0**: Initial release with basic scraping functionality
