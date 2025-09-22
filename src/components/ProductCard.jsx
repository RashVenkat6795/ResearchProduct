import React from 'react';
import { formatCurrency, formatNumber, calculateBrandingPotential } from '../utils/productUtils';

const ProductCard = ({ product, isShortlisted, onToggleShortlist }) => {
  const brandingPotential = calculateBrandingPotential(product.name, product.reviews);

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      isShortlisted ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50' : 'border-gray-200 hover:border-blue-200'
    }`}>
      <div className="p-6">
        {/* Header with title and shortlist button */}
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 mr-4 leading-tight">
            {product.name}
          </h3>
          <button
            onClick={() => onToggleShortlist(product.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md ${
              isShortlisted
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:shadow-blue-200'
            }`}
          >
            {isShortlisted ? '✓ Listed' : '+ Add'}
          </button>
        </div>

        {/* Product details grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Price</span>
            <p className="text-xl font-bold text-green-700 mt-1">{formatCurrency(product.price)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Reviews</span>
            <p className="text-xl font-bold text-blue-700 mt-1">{formatNumber(product.reviews)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
            <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">BSR</span>
            <p className="text-xl font-bold text-purple-700 mt-1">#{formatNumber(product.bsr)}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
            <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">Weight</span>
            <p className="text-xl font-bold text-orange-700 mt-1">{product.weight} kg</p>
          </div>
        </div>

        {/* Category and Brand */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-gray-50 px-4 py-2 rounded-lg">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</span>
            <p className="font-semibold text-gray-800 mt-1">{product.category}</p>
          </div>
          <div className="bg-gray-50 px-4 py-2 rounded-lg">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Brand</span>
            <p className="font-semibold text-gray-800 mt-1">{product.brand}</p>
          </div>
        </div>

        {/* Branding Potential */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
          <span className="text-sm font-medium text-gray-700">Branding Potential</span>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            brandingPotential === 'High'
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
              : 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg'
          }`}>
            {brandingPotential === 'High' ? '🚀 High' : '⚠️ Low'}
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
