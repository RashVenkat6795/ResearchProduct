import React, { useState } from 'react';
import { FilterPanel } from './components/FilterPanel';
import { ProductTable } from './components/ProductTable';
import { apiService, Filters, Product } from './services/api';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { ShoppingCart, TrendingUp, Filter, CheckCircle } from 'lucide-react';


export default function App() {
  const [filters, setFilters] = useState({
    minPrice: 300,
    maxPrice: 2500,
    maxReviews: 1000,
    minBSR: 1,
    maxBSR: 50,
    maxWeight: 2,
    excludeAmazonLaunched: true,
    excludeFragile: true,
    excludeFood: true,
    excludeElectronics: true,
    excludeSizeVariations: true,
  });

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    
    try {
      const response = await apiService.getProducts(filters);
      if (response.success && response.products) {
        setProducts(response.products);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrapeAll = async () => {
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    
    try {
      const response = await apiService.getAllProducts();
      if (response.success && response.products) {
        setProducts(response.products);
      } else {
        setError(response.message || 'Failed to fetch all products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching all products');
      console.error('Error fetching all products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    
    // If we've already searched, update results in real-time
    if (hasSearched && !isLoading) {
      handleScrape();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-20">
        <div className="flex items-center justify-center gap-3">
          <ShoppingCart className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-semibold">Amazon Best Seller Product Research</h1>
        </div>
      </div>

      {/* Criteria Overview */}
      <div className="px-4 py-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Analysis Criteria Overview</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Price Range</span>
                </div>
                <p className="text-xs text-muted-foreground">₹300-₹2500 (ideal: ₹500-₹2000)</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Reviews</span>
                </div>
                <p className="text-xs text-muted-foreground">&lt;1000 (ideal: &lt;500)</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">BSR</span>
                </div>
                <p className="text-xs text-muted-foreground">100-5000 (ideal: 200-2000)</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Weight</span>
                </div>
                <p className="text-xs text-muted-foreground">&lt;2kg (ideal: &lt;1kg)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Fixed Filter Panel */}
        <div className="w-80 bg-white border-r flex-shrink-0 overflow-y-auto">
          <div className="p-4">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onScrape={handleScrape}
              onScrapeAll={handleScrapeAll}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {error && (
              <Card>
                <CardContent className="p-4">
                  <div className="text-red-600 text-center">
                    <p className="font-medium">Error: {error}</p>
                    <p className="text-sm mt-1">Please check if the backend server is running on port 3001</p>
                  </div>
                </CardContent>
              </Card>
            )}
            <ProductTable products={products} isLoading={isLoading} />
            
            {/* Footer Note */}
            {/* <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This application connects to the Amazon scraper backend to fetch real product data. 
                  The backend attempts to scrape Amazon bestsellers and applies your filtering criteria to find profitable opportunities.
                </p>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
}