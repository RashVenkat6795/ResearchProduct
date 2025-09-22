import React, { useState } from 'react';
import FilterModal from './FilterModal';

const Filters = ({ 
  filters, 
  onFilterChange, 
  categories, 
  totalProducts, 
  filteredCount 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value === '' ? null : value
    });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({
      ...filters,
      category
    });
  };

  const handleBrandingChange = (brandingPotential) => {
    onFilterChange({
      ...filters,
      brandingPotential
    });
  };

  const resetFilters = () => {
    onFilterChange({
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

  const hasActiveFilters = () => {
    return (
      filters.minPrice !== null ||
      filters.maxPrice !== null ||
      filters.minBsr !== null ||
      filters.maxBsr !== null ||
      filters.maxReviews !== null ||
      filters.maxWeight !== null ||
      filters.category !== 'All' ||
      filters.brandingPotential !== 'All'
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.minPrice !== null || filters.maxPrice !== null) count++;
    if (filters.minBsr !== null || filters.maxBsr !== null) count++;
    if (filters.maxReviews !== null) count++;
    if (filters.maxWeight !== null) count++;
    if (filters.category !== 'All') count++;
    if (filters.brandingPotential !== 'All') count++;
    return count;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/50">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            hasActiveFilters() 
              ? 'bg-gradient-to-r from-red-500 to-pink-500' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
            {hasActiveFilters() && (
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {getActiveFilterCount()} active
                </span>
                <span className="text-xs text-red-600">• Applied</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters() && (
            <button
              onClick={resetFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              Reset
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              hasActiveFilters()
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Filter
              {hasActiveFilters() && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-white/20 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Results Summary */}
        <div className={`p-4 rounded-lg ${
          hasActiveFilters() 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-gray-50'
        }`}>
          <p className={`text-sm ${
            hasActiveFilters() ? 'text-red-800' : 'text-gray-600'
          }`}>
            <span className={`font-semibold ${
              hasActiveFilters() ? 'text-red-600' : 'text-blue-600'
            }`}>
              {filteredCount}
            </span> of{' '}
            <span className="font-semibold">{totalProducts}</span> products match filters
          </p>
          {filteredCount === 0 && totalProducts > 0 && (
            <p className="text-xs text-amber-600 mt-1">
              💡 Try relaxing your filters to see more results
            </p>
          )}
          {hasActiveFilters() && (
            <div className="mt-2">
              <p className="text-xs text-red-600">
                🔴 {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} currently active
              </p>
            </div>
          )}
        </div>

        {/* Quick Filter Summary */}
        {hasActiveFilters() && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {(filters.minPrice !== null || filters.maxPrice !== null) && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Price: {filters.minPrice || '0'} - {filters.maxPrice || '∞'}
                </span>
              )}
              {(filters.minBsr !== null || filters.maxBsr !== null) && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  BSR: {filters.minBsr || '0'} - {filters.maxBsr || '∞'}
                </span>
              )}
              {filters.maxReviews !== null && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Reviews: ≤{filters.maxReviews}
                </span>
              )}
              {filters.maxWeight !== null && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Weight: ≤{filters.maxWeight}kg
                </span>
              )}
              {filters.category !== 'All' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Category: {filters.category}
                </span>
              )}
              {filters.brandingPotential !== 'All' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Branding: {filters.brandingPotential}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filters={filters}
        onApplyFilters={onFilterChange}
        categories={categories}
      />
    </div>
  );
};

export default Filters;
