import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import AnalysisResults from './AnalysisResults';

const ScrapingControls = ({ onDataScraped, isServerRunning }) => {
  const [isScraping, setIsScraping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [scrapingStatus, setScrapingStatus] = useState('');
  const [lastScrapeTime, setLastScrapeTime] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleScrape = async () => {
    if (!isServerRunning) {
      setScrapingStatus('Server is not running. Please start the backend server.');
      return;
    }

    setIsScraping(true);
    setScrapingStatus('Starting scraping...');

    try {
      setScrapingStatus(`Scraping ${selectedCategory} category...`);
      const response = await apiService.scrapeBestsellers(selectedCategory);

      if (response.success) {
        setScrapingStatus(`Successfully scraped ${response.count} products`);
        setLastScrapeTime(new Date().toLocaleTimeString());
        
        // Pass the scraped data to parent component
        if (onDataScraped) {
          onDataScraped(response.products);
        }
      } else {
        setScrapingStatus('Scraping failed: ' + response.message);
      }
    } catch (error) {
      console.error('Scraping error:', error);
      setScrapingStatus(`Scraping failed: ${error.message}`);
    } finally {
      setIsScraping(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!isServerRunning) {
      setScrapingStatus('Server is not running. Please start the backend server.');
      return;
    }

    setIsAnalyzing(true);
    setScrapingStatus('Running comprehensive analysis...');

    try {
      // Categories to analyze (excluding electronics)
      const analysisCategories = [
        'home-kitchen', 'beauty-personal-care', 'clothing-accessories',
        'sports-fitness', 'books', 'bags-wallets-luggage',
        'shoes-handbags', 'office-products', 'pet-supplies',
        'jewellery', 'watches', 'toys-games'
      ];

      const allProducts = [];
      const categoryStats = {};

      // Scrape all categories
      for (const category of analysisCategories) {
        setScrapingStatus(`Analyzing ${category}...`);
        try {
          const response = await apiService.scrapeBestsellers(category);
          if (response.success) {
            const products = response.products || [];
            categoryStats[category] = products.length;
            products.forEach(product => {
              product.scrapedFromCategory = category;
            });
            allProducts.push(...products);
          }
        } catch (error) {
          console.error(`Error scraping ${category}:`, error);
          categoryStats[category] = 0;
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Apply your specific criteria
      const filteredProducts = allProducts.filter(product => {
        return (
          product.price >= 300 && product.price <= 2500 &&
          product.reviews <= 1000 &&
          product.bsr >= 1 && product.bsr <= 100 &&
          product.weight <= 2.0 &&
          !product.isAmazonLaunched &&
          !product.isFragile &&
          !product.isGrocery &&
          !product.category.toLowerCase().includes('electronics') &&
          !product.hasConfusingSizes &&
          getBrandingPotential(product.name) === 'Low'
        );
      });

      // Calculate scores
      filteredProducts.forEach(product => {
        product.score = calculateProductScore(product);
      });

      // Sort by score
      filteredProducts.sort((a, b) => b.score - a.score);

      // Generate category breakdown
      const categoryBreakdown = Object.entries(categoryStats).map(([category, scraped]) => ({
        category,
        scraped,
        filtered: filteredProducts.filter(p => p.scrapedFromCategory === category).length
      }));

      // Create analysis results
      const analysisData = {
        products: filteredProducts,
        summary: {
          totalProducts: allProducts.length,
          filteredProducts: filteredProducts.length,
          successRate: ((filteredProducts.length / allProducts.length) * 100).toFixed(2),
          categoriesAnalyzed: analysisCategories.length
        },
        categoryBreakdown
      };

      setAnalysisResults(analysisData);
      setScrapingStatus(`Analysis complete! Found ${filteredProducts.length} products meeting your criteria.`);
      
      // Also pass the data to parent component
      if (onDataScraped) {
        onDataScraped(allProducts);
      }

    } catch (error) {
      console.error('Analysis error:', error);
      setScrapingStatus(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to determine branding potential
  const getBrandingPotential = (title) => {
    const genericTerms = [
      'bottle', 'cable', 'cover', 'case', 'bag', 'holder', 'stand', 'mount',
      'adapter', 'charger', 'protector', 'screen', 'film', 'strap', 'band',
      'clip', 'hook', 'hanger', 'organizer', 'container', 'box', 'tray',
      'mat', 'pad', 'cushion', 'pillow', 'blanket', 'sheet', 'towel',
      'brush', 'comb', 'sponge', 'cloth', 'wipe', 'cleaner', 'soap',
      'candle', 'light', 'lamp', 'bulb', 'switch', 'plug', 'socket',
      'kit', 'set', 'pack', 'bundle', 'combo', 'collection', 'accessory',
      'tool', 'gadget', 'device', 'equipment', 'supply', 'item'
    ];
    
    const lowerTitle = title.toLowerCase();
    const hasGenericTerms = genericTerms.some(term => lowerTitle.includes(term));
    
    return hasGenericTerms ? 'Low' : 'High';
  };

  // Helper function to calculate product score
  const calculateProductScore = (product) => {
    let score = 0;
    
    // Price scoring (prefer ₹500-₹2000)
    if (product.price >= 500 && product.price <= 2000) {
      score += 30;
    } else if (product.price >= 300 && product.price <= 2500) {
      score += 20;
    } else {
      score += 5;
    }
    
    // Review scoring (prefer <500)
    if (product.reviews < 500) {
      score += 25;
    } else if (product.reviews < 1000) {
      score += 15;
    } else {
      score += 5;
    }
    
    // BSR scoring (prefer 1-10)
    if (product.bsr >= 1 && product.bsr <= 10) {
      score += 25;
    } else if (product.bsr >= 11 && product.bsr <= 50) {
      score += 20;
    } else if (product.bsr >= 51 && product.bsr <= 100) {
      score += 15;
    } else {
      score += 5;
    }
    
    // Weight scoring (prefer <1kg)
    if (product.weight < 1.0) {
      score += 20;
    } else if (product.weight < 2.0) {
      score += 10;
    } else {
      score += 0;
    }
    
    // Branding potential scoring
    const brandingPotential = getBrandingPotential(product.name);
    if (brandingPotential === 'Low') {
      score += 20;
    } else {
      score += 5;
    }
    
    return score;
  };

  const categoryLabels = {
    'all': 'All Categories',
    'electronics': 'Electronics',
    'home-kitchen': 'Home & Kitchen',
    'clothing-accessories': 'Clothing & Accessories',
    'beauty-personal-care': 'Beauty & Personal Care',
    'sports-fitness': 'Sports & Fitness',
    'books': 'Books',
    'toys-games': 'Toys & Games',
    'automotive': 'Automotive',
    'grocery-gourmet-foods': 'Grocery & Gourmet Foods'
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/50">
      {/* <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Data Scraper</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
          isServerRunning 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {isServerRunning ? '🟢 Online' : '🔴 Offline'}
        </div>
      </div> */}

      <div className="space-y-4">
        {/* Category Selection */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isScraping}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        {/* Combined Scraping Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleScrape}
            disabled={isScraping || isAnalyzing || !isServerRunning}
            className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
              isScraping || isAnalyzing || !isServerRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isScraping ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span className="text-sm">Scraping...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm">Scrape All</span>
              </div>
            )}
          </button>

          <button
            onClick={handleRunAnalysis}
            disabled={isScraping || isAnalyzing || !isServerRunning}
            className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
              isScraping || isAnalyzing || !isServerRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span className="text-sm">Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm">Run Full Analysis</span>
              </div>
            )}
          </button>
        </div>

        {/* Status Message */}
        {scrapingStatus && (
          <div className={`p-3 rounded-lg text-sm ${
            scrapingStatus.includes('Successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200'
              : scrapingStatus.includes('failed') || scrapingStatus.includes('not running')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {scrapingStatus}
          </div>
        )}

        {/* Last Scrape Time */}
        {lastScrapeTime && (
          <div className="text-xs text-gray-500 text-center">
            Last updated: {lastScrapeTime}
          </div>
        )}
      </div>

      {/* Analysis Results Modal */}
      {analysisResults && (
        <AnalysisResults
          analysisData={analysisResults}
          onClose={() => setAnalysisResults(null)}
        />
      )}
    </div>
  );
};

export default ScrapingControls;
