import React from 'react';

const Filters = ({ 
  filters, 
  onFilterChange, 
  categories, 
  totalProducts, 
  filteredCount 
}) => {
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        {/* Results Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredCount}</span> of{' '}
            <span className="font-semibold">{totalProducts}</span> products
          </p>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (₹)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* BSR Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Best Seller Rank Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minBsr || ''}
              onChange={(e) => handleInputChange('minBsr', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxBsr || ''}
              onChange={(e) => handleInputChange('maxBsr', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Max Reviews */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Reviews
          </label>
          <input
            type="number"
            placeholder="Maximum reviews"
            value={filters.maxReviews || ''}
            onChange={(e) => handleInputChange('maxReviews', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Max Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Weight (kg)
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="Maximum weight"
            value={filters.maxWeight || ''}
            onChange={(e) => handleInputChange('maxWeight', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Branding Potential */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Branding Potential
          </label>
          <select
            value={filters.brandingPotential}
            onChange={(e) => handleBrandingChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
