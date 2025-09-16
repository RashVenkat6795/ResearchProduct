import React, { useState, useEffect, useMemo } from 'react';
import { mockProducts } from './data/mockData';
import { filterProducts, applyUserFilters, getUniqueCategories } from './utils/productUtils';
import { apiService } from './services/api';
import Filters from './components/Filters';
import ProductTable from './components/ProductTable';
import ExportButton from './components/ExportButton';
import ScrapingControls from './components/ScrapingControls';

function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [shortlistedProducts, setShortlistedProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [dataSource, setDataSource] = useState('mock'); // 'mock' or 'scraped'
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    minBsr: null,
    maxBsr: null,
    maxReviews: null,
    maxWeight: null,
    category: 'All',
    brandingPotential: 'All'
  });

  // Initialize data
  useEffect(() => {
    setAllProducts(mockProducts);
  }, []);

  // Check server status
  useEffect(() => {
    const checkServerStatus = async () => {
      const isRunning = await apiService.isServerRunning();
      setIsServerRunning(isRunning);
    };
    
    checkServerStatus();
    // Check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Load shortlisted products from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('shortlistedProducts');
    if (saved) {
      setShortlistedProducts(JSON.parse(saved));
    }
  }, []);

  // Save shortlisted products to localStorage
  useEffect(() => {
    localStorage.setItem('shortlistedProducts', JSON.stringify(shortlistedProducts));
  }, [shortlistedProducts]);

  // Apply core filtering and user filters
  const processedProducts = useMemo(() => {
    // First apply core business logic filters
    const coreFiltered = filterProducts(allProducts);
    // Then apply user-defined filters
    return applyUserFilters(coreFiltered, filters);
  }, [allProducts, filters]);

  useEffect(() => {
    setFilteredProducts(processedProducts);
  }, [processedProducts]);

  const categories = getUniqueCategories(allProducts);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleToggleShortlist = (productId) => {
    setShortlistedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const getShortlistedProducts = () => {
    return allProducts.filter(product => shortlistedProducts.includes(product.id));
  };

  const handleDataScraped = (scrapedProducts) => {
    setAllProducts(scrapedProducts);
    setDataSource('scraped');
    // Reset filters when new data is loaded
    setFilters({
      minPrice: null,
      maxPrice: null,
      minBsr: null,
      maxBsr: null,
      maxReviews: null,
      maxWeight: null,
      category: 'All',
      brandingPotential: 'All'
    });
  };

  const loadMockData = () => {
    setAllProducts(mockProducts);
    setDataSource('mock');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ecommerce Product Research
              </h1>
              <p className="text-gray-600 mt-1">
                Amazon India Bestsellers Analysis & Filtering Tool
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  dataSource === 'scraped' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {dataSource === 'scraped' ? 'Live Data' : 'Mock Data'}
                </span>
                <span className="text-xs text-gray-500">
                  {allProducts.length} products loaded
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Shortlisted: <span className="font-semibold text-blue-600">{shortlistedProducts.length}</span>
              </div>
              <button
                onClick={loadMockData}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Load Mock Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ScrapingControls 
              onDataScraped={handleDataScraped}
              isServerRunning={isServerRunning}
            />
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
              totalProducts={allProducts.length}
              filteredCount={filteredProducts.length}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Products ({filteredProducts.length})
                </h2>
                
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'table'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Table
                  </button>
                </div>
              </div>

              <ExportButton products={filteredProducts} filename="filtered_products" />
            </div>

            {/* Products Display */}
            <ProductTable
              products={filteredProducts}
              shortlistedProducts={shortlistedProducts}
              onToggleShortlist={handleToggleShortlist}
              viewMode={viewMode}
            />

            {/* Shortlisted Products Section */}
            {shortlistedProducts.length > 0 && (
              <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Shortlisted Products ({shortlistedProducts.length})
                  </h2>
                  <ExportButton 
                    products={getShortlistedProducts()} 
                    filename="shortlisted_products" 
                  />
                </div>
                <ProductTable
                  products={getShortlistedProducts()}
                  shortlistedProducts={shortlistedProducts}
                  onToggleShortlist={handleToggleShortlist}
                  viewMode={viewMode}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
