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
  const [viewMode, setViewMode] = useState('table');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'filtered'
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

  // Initialize data - start with empty array, will be populated by scraping
  useEffect(() => {
    setAllProducts([]);
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
    // Mock data loading removed - only scraped data is used
    console.log('Mock data loading is disabled. Please use the scraping feature to load data.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.15) 2px, transparent 0)`,
        backgroundSize: '50px 50px'
      }}></div>
      <div className="relative z-10">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Amazon Product Research
                </h1>
              </div>
              {/* <div className="flex items-center gap-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  dataSource === 'scraped' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {dataSource === 'scraped' ? '🟢 Live Data' : '🟡 No Data'}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  📊 {allProducts.length} products
                </span>
                <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  ⭐ {shortlistedProducts.length} shortlisted
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </header>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
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
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8 mb-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
      <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      Products
                    </h2>
                    <p className="text-gray-600">
                      {activeTab === 'all' ? allProducts.length : filteredProducts.length} found
                    </p>
                  </div>
                  
                  {/* Tab Toggle */}
                  <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-1 border border-gray-300">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'all'
                          ? 'bg-white text-gray-700 shadow-md border border-gray-300'
                          : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-2 h-2 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      All Products
                    </button>
                    <button
                      onClick={() => setActiveTab('filtered')}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'filtered'
                          ? 'bg-white text-gray-700 shadow-md border border-gray-300'
                          : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-2 h-2 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                      </svg>
                      Filtered Products
                    </button>
        </div>

                  {/* Table View Indicator */}
                  <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-2 border border-blue-200">
                    <svg className="w-2 h-2 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-700">Table View</span>
                  </div>
                </div>

                <ExportButton 
                  products={activeTab === 'all' ? allProducts : filteredProducts} 
                  filename={activeTab === 'all' ? 'all_products' : 'filtered_products'} 
                />
              </div>
            </div>

            {/* Products Display */}
            <ProductTable
              products={activeTab === 'all' ? allProducts : filteredProducts}
              shortlistedProducts={shortlistedProducts}
              onToggleShortlist={handleToggleShortlist}
              isFiltered={activeTab === 'filtered'}
            />

            {/* Shortlisted Products Section */}
            {shortlistedProducts.length > 0 && (
              <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Shortlisted ({shortlistedProducts.length})
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
                  isFiltered={false}
                />
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
      </div>
    );
}

export default App;
