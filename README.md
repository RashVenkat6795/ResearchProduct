# Amazon Product Research Tool

A powerful web application that helps you find profitable Amazon products using advanced filtering criteria. The tool scrapes Amazon bestsellers and applies intelligent filters to identify products with high potential for private labeling.

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, make sure you have the following installed on your computer:

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Choose the "LTS" (Long Term Support) version
   - During installation, make sure to check "Add to PATH"

2. **Git** (optional, for downloading the project)
   - Download from: https://git-scm.com/

### Installation Steps

#### Step 1: Download the Project
- Download the project folder to your computer
- Extract it if it's in a zip file
- Remember the location where you saved it

#### Step 2: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, and press Enter
- **Mac**: Press `Cmd + Space`, type "Terminal", and press Enter
- **Linux**: Press `Ctrl + Alt + T`

#### Step 3: Navigate to the Project Folder
In your terminal, type the following command (replace the path with your actual project location):

```bash
cd /path/to/your/ResearchProduct
```

For example, if you saved it on your Desktop:
```bash
cd ~/Desktop/ResearchProduct
```

#### Step 4: Install Backend Dependencies
```bash
cd amazon-scraper-v2
npm install
```

Wait for the installation to complete. You'll see a message like "added X packages" when it's done.

#### Step 5: Install Frontend Dependencies
Open a new terminal window/tab and navigate to the project folder again:
```bash
cd /path/to/your/ResearchProduct
cd front-end-ui
npm install
```

Wait for this installation to complete as well.

### Running the Application

#### Step 1: Start the Backend Server
In your first terminal window (the one where you installed backend dependencies):
```bash
cd amazon-scraper-v2
npm start
```

You should see a message like:
```
🚀 Amazon Scraper API v2 running on http://localhost:3001
```

**Keep this terminal window open** - the backend server needs to keep running.

#### Step 2: Start the Frontend Application
In your second terminal window (the one where you installed frontend dependencies):
```bash
cd front-end-ui
npm run dev
```

You should see a message like:
```
VITE v6.3.5  ready in 411 ms
➜  Local:   http://localhost:3000/
```

#### Step 3: Open the Application
Open your web browser and go to: **http://localhost:3000**

You should now see the Amazon Product Research Tool interface!

## 🎯 How to Use the Application

### Understanding the Interface

1. **Filter Panel** (left side): Set your criteria for finding profitable products
2. **Results Table** (right side): View the filtered products
3. **Scrape Products Button**: Start the search with your current filters

### Setting Up Your Filters

#### Price Range
- **Minimum Price**: Set the lowest price you want to consider (recommended: ₹300-₹500)
- **Maximum Price**: Set the highest price you want to consider (recommended: ₹2000-₹2500)

#### Competition Analysis
- **Maximum Reviews**: Products with fewer reviews have less competition (recommended: <1000, ideal: <500)
- **BSR Range**: Best Seller Rank - lower numbers mean better selling products
  - **Minimum BSR**: 100-200 (products that are selling well)
  - **Maximum BSR**: 2000-5000 (not too competitive)

#### Product Characteristics
- **Maximum Weight**: Lighter products are cheaper to ship (recommended: <2kg, ideal: <1kg)

#### Exclusions (Check these boxes to avoid)
- ✅ **Amazon launched products**: Avoid competing with Amazon's own brands
- ✅ **Fragile items**: Avoid products that can break during shipping
- ✅ **Food items**: Avoid products with expiration dates
- ✅ **Electronics**: Avoid complex products with warranty issues
- ✅ **Size variations**: Avoid products with confusing size options

### Running a Search

1. Set your desired filters using the left panel
2. Click the **"Scrape Products"** button
3. Wait for the results to load (this may take 10-30 seconds)
4. Review the products in the results table

### Understanding the Results

Each product shows:
- **Product Name**: The full Amazon product title
- **Price**: Current selling price in ₹
- **Reviews**: Number of customer reviews
- **BSR**: Best Seller Rank (lower is better)
- **Weight**: Product weight in kg
- **Category**: Product category
- **Branding Potential**: Low/Medium/High (based on competition analysis)
- **Compliance**: Whether the product meets your exclusion criteria
- **Link**: Direct link to the Amazon product page

### Tips for Success

1. **Start with default filters** and adjust based on your results
2. **Look for products with "High" branding potential**
3. **Avoid products marked with "Issues" in the Compliance column**
4. **Focus on products with fewer than 500 reviews**
5. **Consider products in the ₹500-₹2000 price range**

## 🔧 Troubleshooting

### Common Issues

#### "Cannot find module" errors
- Make sure you ran `npm install` in both the `amazon-scraper-v2` and `front-end-ui` folders
- Try deleting the `node_modules` folder and running `npm install` again

#### "Port already in use" errors
- Close other applications that might be using the same ports
- Restart your computer if the issue persists

#### Backend server won't start
- Make sure you're in the `amazon-scraper-v2` folder when running `npm start`
- Check that Node.js is properly installed by running `node --version`

#### Frontend won't load
- Make sure the backend server is running first
- Check that you're using the correct URL: http://localhost:3000
- Try refreshing the page

#### No products found
- Try relaxing your filters (increase max price, max reviews, etc.)
- The scraper uses real Amazon data, so results may vary

### Getting Help

If you encounter issues:
1. Check that both servers are running (backend on port 3001, frontend on port 3000)
2. Make sure you're using a modern web browser (Chrome, Firefox, Safari, Edge)
3. Try restarting both servers by closing the terminal windows and starting again

## 📁 Project Structure

```
ResearchProduct/
├── amazon-scraper-v2/          # Backend server
│   ├── server.js               # Main server file
│   ├── package.json            # Backend dependencies
│   └── node_modules/           # Backend packages
├── front-end-ui/               # Frontend application
│   ├── src/                    # Source code
│   ├── package.json            # Frontend dependencies
│   └── node_modules/           # Frontend packages
└── README.md                   # This file
```

## 🎉 You're All Set!

The Amazon Product Research Tool is now ready to help you find profitable products. Remember to:

1. Keep both terminal windows open while using the application
2. Start with the default filters and adjust as needed
3. Look for products with high branding potential and good compliance scores
4. Use the direct Amazon links to research products further

Happy product hunting! 🚀
