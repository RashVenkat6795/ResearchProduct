import React, { useState } from 'react';

const FilterModal = ({ isOpen, onClose, filters, onApplyFilters, categories }) => {
  const [tempFilters, setTempFilters] = useState(filters);

  const handleInputChange = (field, value) => {
    setTempFilters({
      ...tempFilters,
      [field]: value === '' ? null : value
    });
  };

  const handleCategoryChange = (category) => {
    setTempFilters({
      ...tempFilters,
      category
    });
  };

  const handleBrandingChange = (brandingPotential) => {
    setTempFilters({
      ...tempFilters,
      brandingPotential
    });
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: null,
      maxPrice: null,
      minBsr: null,
      maxBsr: null,
      maxReviews: null,
      maxWeight: null,
      category: 'All',
      brandingPotential: 'All'
    };
    setTempFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Advanced Filters</h2>
              <p className="text-purple-100 mt-1">Refine your product search</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-140px)] p-6">
          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Price Range (₹)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Minimum Price</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={tempFilters.minPrice || ''}
                    onChange={(e) => handleInputChange('minPrice', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Maximum Price</label>
                  <input
                    type="number"
                    placeholder="e.g. 2000"
                    value={tempFilters.maxPrice || ''}
                    onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* BSR Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Best Seller Rank Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Minimum BSR</label>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    value={tempFilters.minBsr || ''}
                    onChange={(e) => handleInputChange('minBsr', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Maximum BSR</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={tempFilters.maxBsr || ''}
                    onChange={(e) => handleInputChange('maxBsr', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Reviews and Weight */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Maximum Reviews
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={tempFilters.maxReviews || ''}
                  onChange={(e) => handleInputChange('maxReviews', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Maximum Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 2.0"
                  value={tempFilters.maxWeight || ''}
                  onChange={(e) => handleInputChange('maxWeight', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Category and Branding */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category
                </label>
                <select
                  value={tempFilters.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Branding Potential
                </label>
                <select
                  value={tempFilters.brandingPotential}
                  onChange={(e) => handleBrandingChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <option value="All">All Branding Potential</option>
                  <option value="High">High Branding</option>
                  <option value="Low">Low Branding</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button
            onClick={handleReset}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Reset All
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
