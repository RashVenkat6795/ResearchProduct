const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// User agents to rotate for scraping
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
];

// Helper function to get random user agent
const getRandomUserAgent = () => {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

// Helper function to extract price from text
const extractPrice = (priceText) => {
  if (!priceText) return 0;
  const match = priceText.match(/₹[\d,]+/);
  if (match) {
    return parseInt(match[0].replace(/[₹,]/g, ''));
  }
  return 0;
};

// Helper function to extract review count
const extractReviewCount = (reviewText) => {
  if (!reviewText) return 0;
  const match = reviewText.match(/(\d+(?:,\d+)*)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''));
  }
  return 0;
};

// Helper function to determine if product is Amazon launched
const isAmazonLaunched = (title, brand) => {
  const amazonTerms = ['amazon basics', 'amazon brand', 'presto', 'symbol', 'solimo'];
  const lowerTitle = title.toLowerCase();
  const lowerBrand = brand ? brand.toLowerCase() : '';
  
  return amazonTerms.some(term => 
    lowerTitle.includes(term) || lowerBrand.includes(term)
  );
};

// Helper function to determine if product is fragile
const isFragile = (title, category) => {
  const fragileTerms = ['glass', 'ceramic', 'crystal', 'mirror', 'vase'];
  const lowerTitle = title.toLowerCase();
  const lowerCategory = category.toLowerCase();
  
  return fragileTerms.some(term => 
    lowerTitle.includes(term) || lowerCategory.includes(term)
  );
};

// Helper function to determine if product is grocery
const isGrocery = (category) => {
  const groceryCategories = ['grocery', 'food', 'beverage', 'snacks'];
  return groceryCategories.some(term => 
    category.toLowerCase().includes(term)
  );
};

// Helper function to determine if product has confusing sizes
const hasConfusingSizes = (title) => {
  const sizeTerms = ['size', 'small', 'medium', 'large', 'xl', 'xxl', 'inch', 'cm'];
  const lowerTitle = title.toLowerCase();
  
  return sizeTerms.some(term => lowerTitle.includes(term));
};

// Main scraping function
const scrapeAmazonBestsellers = async (category = 'all') => {
  try {
    console.log(`Scraping Amazon bestsellers for category: ${category}`);
    
    // For now, return enhanced mock data based on real Amazon bestsellers structure
    // This simulates what would be scraped from the actual page
    const mockScrapedData = [
      {
        id: 1,
        name: "Tata Salt 1 Kg, Free Flowing and Iodised Namak, Vacuum Evaporated",
        price: 26,
        reviews: 74059,
        bsr: 1,
        category: "Grocery & Gourmet Foods",
        weight: 1.0,
        brand: "Tata",
        isAmazonLaunched: false,
        isFragile: false,
        isGrocery: true,
        expiryDate: "2025-06-15",
        hasConfusingSizes: false
      },
      {
        id: 2,
        name: "Tata Sampann Unpolished Toor Dal/Arhar Dal, 1kg",
        price: 154,
        reviews: 36412,
        bsr: 2,
        category: "Grocery & Gourmet Foods",
        weight: 1.0,
        brand: "Tata",
        isAmazonLaunched: false,
        isFragile: false,
        isGrocery: true,
        expiryDate: "2025-08-20",
        hasConfusingSizes: false
      },
      {
        id: 3,
        name: "Fortune Sunlite Refined Sunflower Oil, 870gm/800gm Pouch",
        price: 172,
        reviews: 41895,
        bsr: 3,
        category: "Grocery & Gourmet Foods",
        weight: 0.87,
        brand: "Fortune",
        isAmazonLaunched: false,
        isFragile: false,
        isGrocery: true,
        expiryDate: "2025-12-31",
        hasConfusingSizes: false
      },
      {
        id: 4,
        name: "Atom 10Kg Kitchen Weight Machine Digital Scale with LCD Display",
        price: 189,
        reviews: 15630,
        bsr: 1,
        category: "Home & Kitchen",
        weight: 0.8,
        brand: "Atom",
        isAmazonLaunched: false,
        isFragile: false,
        isGrocery: false,
        expiryDate: null,
        hasConfusingSizes: false
      },
      {
        id: 5,
        name: "Amazon Brand - Presto! Garbage Bags | Medium | 180 Count",
        price: 335,
        reviews: 50107,
        bsr: 2,
        category: "Home & Kitchen",
        weight: 0.3,
        brand: "Amazon Brand",
        isAmazonLaunched: true,
        isFragile: false,
        isGrocery: false,
        expiryDate: null,
        hasConfusingSizes: false
      },
      {
        id: 6,
        name: "JIALTO 10 Pcs Stainless Steel PVC ABS Nail Free Seamless Adhesive Wall Hook",
        price: 149,
        reviews: 12179,
        bsr: 3,
        category: "Home & Kitchen",
        weight: 0.1,
        brand: "JIALTO",
        isAmazonLaunched: false,
        isFragile: false,
        isGrocery: false,
        expiryDate: null,
        hasConfusingSizes: false
      },
      {
        id: 7,
        name: "Ghar Soaps Sandalwood & Saffron Magic Soaps For Bath (100 Gms Pack Of 2)",
        price: 284,
        reviews: 12384,
        bsr: 1,
        category: "Beauty & Personal Care",
        weight: 0.2,
        brand: "Ghar Soaps",
        isAmazonLaunched: false,
        isFragile: false,
        isGrocery: false,
        expiryDate: null,
        hasConfusingSizes: false
      },
      {
        id: 8,
        name: "WishCare Hair Growth Serum Concentrate - 3% Redensyl, 4% Anagain",
        price: 685,
        reviews: 10155,
        bsr: 2,
        category: "Beauty & Personal Care",
        weight: 0.03,
        brand: "WishCare",
        isAmazonLaunched: false,
        isFragile: true,
        isGrocery: false,
        expiryDate: null,
        hasConfusingSizes: false
      },
      {
        id: 9,
        name: "Safari Pentagon Pro 8 Wheels 66Cm Medium Size Checkin Trolley Bag",
        price: 2599,
        reviews: 27214,
        bsr: 2,
        category: "Bags, Wallets and Luggage",
        weight: 2.5,
        brand: "Safari",
        isAmazonLaunched: false,
        isFragile: false,
        isGrocery: false,
        expiryDate: null,
        hasConfusingSizes: true
      },
      {
        id: 10,
        name: "Jockey 1406 Women's High Coverage Super Combed Cotton Mid Waist Hipster",
        price: 449,
        reviews: 39433,
        bsr: 1,
        category: "Clothing & Accessories",
        weight: 0.1,
        brand: "Jockey",
        isAmazonLaunched: false,
        isFragile: false,
        isGrocery: false,
        expiryDate: null,
        hasConfusingSizes: true
      }
    ];

    console.log(`Returning ${mockScrapedData.length} simulated scraped products`);
    return mockScrapedData;

  } catch (error) {
    console.error('Error in scraping function:', error.message);
    throw error;
  }
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Amazon Scraper API is running' });
});

app.get('/api/scrape', async (req, res) => {
  try {
    const { category = 'all' } = req.query;
    console.log(`API request to scrape category: ${category}`);
    
    const products = await scrapeAmazonBestsellers(category);
    
    res.json({
      success: true,
      count: products.length,
      category: category,
      products: products,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to scrape Amazon bestsellers'
    });
  }
});

app.get('/api/categories', (req, res) => {
  const categories = [
    'all',
    'electronics',
    'home-kitchen',
    'clothing-accessories',
    'beauty-personal-care',
    'sports-fitness',
    'books',
    'toys-games',
    'automotive',
    'grocery-gourmet-foods'
  ];
  
  res.json({
    success: true,
    categories: categories
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Amazon Scraper API running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`- GET /api/health - Health check`);
  console.log(`- GET /api/scrape?category=all - Scrape bestsellers`);
  console.log(`- GET /api/categories - Get available categories`);
});
