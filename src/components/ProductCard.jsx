import React from 'react';
import { formatCurrency, formatNumber, calculateBrandingPotential } from '../utils/productUtils';

const ProductCard = ({ product, isShortlisted, onToggleShortlist }) => {
  const brandingPotential = calculateBrandingPotential(product.name, product.reviews);

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 hover:shadow-lg ${
      isShortlisted ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
    }`}>
      <div className="p-6">
        {/* Header with title and shortlist button */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 flex-1 mr-3">
            {product.name}
          </h3>
          <button
            onClick={() => onToggleShortlist(product.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isShortlisted
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
            }`}
          >
            {isShortlisted ? '✓ Listed' : '+ Add'}
          </button>
        </div>

        {/* Product details grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-500">Price</span>
            <p className="font-semibold text-green-600">{formatCurrency(product.price)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Reviews</span>
            <p className="font-semibold text-gray-800">{formatNumber(product.reviews)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">BSR</span>
            <p className="font-semibold text-gray-800">#{formatNumber(product.bsr)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Weight</span>
            <p className="font-semibold text-gray-800">{product.weight} kg</p>
          </div>
        </div>

        {/* Category and Brand */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-gray-500">Category</span>
            <p className="font-medium text-gray-700">{product.category}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Brand</span>
            <p className="font-medium text-gray-700">{product.brand}</p>
          </div>
        </div>

        {/* Branding Potential */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Branding Potential</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            brandingPotential === 'High'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {brandingPotential}
          </span>
        </div>

        {/* Product flags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {product.isAmazonLaunched && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
              Amazon
            </span>
          )}
          {product.isFragile && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
              Fragile
            </span>
          )}
          {product.isGrocery && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
              Grocery
            </span>
          )}
          {product.hasConfusingSizes && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
              Size Issues
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
