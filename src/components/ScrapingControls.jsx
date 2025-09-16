import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const ScrapingControls = ({ onDataScraped, isServerRunning }) => {
  const [isScraping, setIsScraping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [scrapingStatus, setScrapingStatus] = useState('');
  const [lastScrapeTime, setLastScrapeTime] = useState(null);

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
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Data Scraping</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isServerRunning 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isServerRunning ? 'Server Online' : 'Server Offline'}
        </div>
      </div>

      <div className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category to Scrape
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isScraping}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Scraping Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleScrape}
            disabled={isScraping || !isServerRunning}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              isScraping || !isServerRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isScraping ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Scraping...
              </div>
            ) : (
              'Scrape Amazon Bestsellers'
            )}
          </button>

          {lastScrapeTime && (
            <span className="text-sm text-gray-500">
              Last scraped: {lastScrapeTime}
            </span>
          )}
        </div>

        {/* Status Message */}
        {scrapingStatus && (
          <div className={`p-3 rounded-md text-sm ${
            scrapingStatus.includes('Successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200'
              : scrapingStatus.includes('failed') || scrapingStatus.includes('not running')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {scrapingStatus}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Instructions:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Make sure the backend server is running (npm run server)</li>
            <li>• Select a category to scrape from Amazon India bestsellers</li>
            <li>• Click "Scrape Amazon Bestsellers" to fetch fresh data</li>
            <li>• Scraped data will automatically replace the current product list</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScrapingControls;
