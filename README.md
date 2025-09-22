# Ecommerce Product Research Tool

A comprehensive React-based application for analyzing and filtering Amazon India bestseller products to identify potential opportunities for ecommerce businesses. **Now with real-time web scraping capabilities!**

## 🚀 Features

### Core Functionality
- **Real-time Web Scraping**: Live scraping of Amazon India bestsellers with fallback to enhanced mock data
- **Product Dashboard**: Clean interface displaying products with key metrics
- **Advanced Filtering**: Multiple filter options for precise product selection
- **Branding Potential Analysis**: Automatic calculation of product branding potential
- **Export Capabilities**: Export filtered results to CSV or Excel formats
- **Shortlisting**: Save products of interest in local storage
- **Responsive Design**: Works on desktop and mobile devices

### 🔥 New: Real-time Scraping
- **Live Amazon Data**: Scrapes real products from Amazon India bestsellers
- **Multiple Categories**: Support for different Amazon categories
- **Smart Fallback**: Automatically falls back to enhanced mock data if scraping fails
- **Server Status**: Real-time monitoring of scraping server status

### Filtering Logic

#### Automatic Exclusions
The system automatically excludes products that:
- Are Amazon Launched or Amazon Renewed
- Are fragile items (glass, ceramic, etc.)
- Are grocery items with expiry dates less than 6 months
- Have confusing size variations only

#### Core Criteria
Products are kept if they meet ALL of these criteria:
- Price between ₹500 – ₹2000
- Reviews < 300
- Best Seller Rank (BSR) between 200–2000
- Weight < 1 kg

#### Branding Potential Calculation
- **Low Branding**: Products with generic terms (bottle, cable, cover, etc.) OR reviews < 500
- **High Branding**: Products without generic terms and reviews ≥ 500

### User Filters
- Price range (minimum and maximum)
- BSR range (minimum and maximum)
- Maximum reviews
- Maximum weight
- Category selection
- Branding potential filter

## 📁 Project Structure

```
ResearchProduct/
├── src/                           # Frontend React application
│   ├── components/
│   │   ├── Filters.jsx           # Sidebar filtering component
│   │   ├── ProductCard.jsx       # Individual product card component
│   │   ├── ProductTable.jsx      # Products table/grid display
│   │   ├── ExportButton.jsx      # Export functionality
│   │   └── ScrapingControls.jsx  # Web scraping controls
│   ├── data/
│   │   └── mockData.js           # Sample Amazon product data
│   ├── services/
│   │   └── api.js                # API service for backend communication
│   ├── utils/
│   │   └── productUtils.js       # Filtering and calculation utilities
│   ├── App.jsx                   # Main application component
│   └── index.css                 # TailwindCSS styles
├── amazon-scraper-backend/        # Backend Node.js scraping API
│   ├── server.js                 # Express server with scraping logic
│   ├── package.json              # Backend dependencies
│   └── .env                      # Backend configuration
├── package.json                  # Frontend dependencies and scripts
└── README.md                     # This file
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v18 or higher - **Note**: Vite requires v20+ for optimal performance)
- npm or yarn

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd ResearchProduct
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd amazon-scraper-backend
   npm install
   cd ..
   ```

4. **Start both backend and frontend servers**
   ```bash
   npm run dev:full
   ```
   
   This will start:
   - Backend scraping API on `http://localhost:3001`
   - Frontend React app on `http://localhost:5173`

5. **Alternative: Start servers separately**
   ```bash
   # Terminal 1 - Start backend server
   npm run dev
   
   # Terminal 2 - Start frontend
   npm run dev:full
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 📖 Usage Guide

### 1. Data Scraping (NEW!)
- **Server Status**: Check if the backend scraper is running (green "Server Online" indicator)
- **Category Selection**: Choose which Amazon category to scrape from:
  - All Categories (default)
  - Electronics
  - Home & Kitchen
  - Clothing & Accessories
  - Beauty & Personal Care
  - Sports & Fitness
  - Books
  - Toys & Games
  - Automotive
  - Grocery & Gourmet Foods
- **Scrape Data**: Click "Scrape Amazon Bestsellers" to fetch fresh data from Amazon India
- **Data Source Indicator**: Shows whether you're viewing "Live Data" (scraped) or "Mock Data"
- **Fallback**: If scraping fails, the app automatically falls back to enhanced mock data

### 2. Viewing Products
- Products are displayed in either **Grid** or **Table** view
- Switch between views using the toggle buttons in the top-right
- Each product shows: Name, Price, Reviews, BSR, Weight, Category, and Branding Potential

### 3. Filtering Products
Use the sidebar filters to narrow down products:
- **Price Range**: Set minimum and maximum price limits
- **BSR Range**: Filter by Best Seller Rank range
- **Max Reviews**: Limit by maximum number of reviews
- **Max Weight**: Set maximum weight threshold
- **Category**: Filter by product category
- **Branding Potential**: Show only High or Low branding potential products

### 4. Shortlisting Products
- Click the **"+ Add"** button on any product to shortlist it
- Shortlisted products appear in a separate section below
- Shortlisted products are saved in your browser's local storage
- Use the **"✓ Listed"** button to remove from shortlist

### 5. Exporting Data
- **Export Filtered Results**: Download current filtered products as CSV or Excel
- **Export Shortlisted Products**: Download only shortlisted products
- Files are named automatically (e.g., `filtered_products.csv`, `shortlisted_products.xlsx`)

### 6. Understanding Product Flags
Products may show colored badges indicating:
- **Amazon**: Amazon Launched products (automatically excluded)
- **Fragile**: Fragile items (automatically excluded)
- **Grocery**: Grocery items (checked for expiry)
- **Size Issues**: Products with confusing size variations (automatically excluded)

## 🔧 Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **XLSX**: Excel file generation library
- **Axios**: HTTP client for API communication

### Backend
- **Express.js**: Web server framework
- **Cheerio**: Server-side HTML parsing and manipulation
- **Axios**: HTTP client for web scraping
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## 🌐 Scraping Implementation

### How It Works
The application includes a complete web scraping solution:

1. **Backend Server** (`amazon-scraper-backend/server.js`):
   - Express.js API server running on port 3001
   - Scrapes Amazon India bestsellers using Cheerio
   - Multiple user agents for request rotation
   - Fallback to enhanced mock data if scraping fails
   - CORS enabled for frontend communication

2. **Scraping Logic**:
   - Targets Amazon India bestsellers page: `https://www.amazon.in/gp/bestsellers`
   - Extracts product information: title, price, reviews, BSR, category
   - Applies business logic filters automatically
   - Calculates branding potential
   - Handles rate limiting and errors gracefully

3. **API Endpoints**:
   - `GET /api/health` - Server health check
   - `GET /api/scrape?category=all` - Scrape bestsellers
   - `GET /api/categories` - Get available categories

### Real Scraping Results
The scraper successfully extracts real data from Amazon India, including:
- Product names and descriptions
- Current prices in Indian Rupees
- Review counts and ratings
- Best Seller Rankings
- Categories and brands
- Product flags (Amazon launched, fragile, etc.)

## 🚀 Future Enhancements

### Advanced Scraping Features
- **Puppeteer Integration**: For JavaScript-heavy pages
- **Proxy Support**: For better scraping reliability
- **Scheduled Scraping**: Automatic data updates
- **Multi-threaded Scraping**: Faster data collection
- **Database Storage**: Persistent product data

### Additional Features
- Real-time price monitoring
- Competitor analysis
- Profit margin calculations
- Inventory tracking
- Automated alerts for new opportunities
- Historical data analysis

## 🛠 Customization

### Adding New Filters
1. Update the `filters` state in `App.jsx`
2. Add UI controls in `Filters.jsx`
3. Implement filter logic in `productUtils.js`

### Modifying Business Logic
Edit the `filterProducts` function in `productUtils.js` to adjust:
- Exclusion criteria
- Core filtering requirements
- Branding potential calculation

### Styling Changes
All styling uses TailwindCSS classes. Modify components directly or extend the Tailwind configuration in `tailwind.config.js`.

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change port in amazon-scraper-backend/.env
   PORT=3002
   ```

2. **Node.js version issues**
   ```bash
   # Update Node.js to v20+ for best performance
   # Or use nvm to manage versions
   nvm use 20
   ```

3. **Scraping fails**
   - Check internet connection
   - Verify Amazon is accessible
   - Check browser console for CORS errors
   - Ensure backend server is running

4. **Build errors**
   ```bash
   npm install --force
   npm run build
   ```

### Performance Tips
- Use the Table view for large datasets
- Apply filters to reduce the number of displayed products
- Export data for offline analysis
- Monitor server status for scraping issues

## 📄 License

This project is for educational and research purposes. Please ensure compliance with Amazon's terms of service when scraping their data.

## 🤝 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all dependencies are installed correctly
3. Ensure Node.js version compatibility
4. Check that both frontend and backend servers are running

---

**🎉 Success!** The application now successfully scrapes real Amazon India bestseller data and provides a comprehensive product research platform for ecommerce businesses.