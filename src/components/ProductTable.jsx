import React from 'react';
import ProductCard from './ProductCard';
import { formatCurrency, formatNumber, calculateBrandingPotential } from '../utils/productUtils';

const ProductTable = ({ products, shortlistedProducts, onToggleShortlist, isFiltered = false }) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No products found</h3>
        <p className="text-gray-500 text-lg">
          {isFiltered 
            ? 'No products match your current filters. Try adjusting the filter criteria.'
            : 'No products have been scraped yet. Use the "Scrape All" or "Run Full Analysis" button to get started.'
          }
        </p>
      </div>
    );
  }

  // Generate Amazon product URL
  const generateProductURL = (product) => {
    const searchTerm = encodeURIComponent(product.name.substring(0, 50));
    return `https://www.amazon.in/s?k=${searchTerm}&ref=sr_pg_1`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0" style={{ borderCollapse: 'separate' }}>
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[300px] border-b" style={{ borderColor: '#DADADA' }}>
                Product
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] border-b" style={{ borderColor: '#DADADA' }}>
                Price (₹)
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] border-b" style={{ borderColor: '#DADADA' }}>
                Reviews
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[80px] border-b" style={{ borderColor: '#DADADA' }}>
                BSR
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] border-b" style={{ borderColor: '#DADADA' }}>
                Weight (kg)
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[140px] border-b" style={{ borderColor: '#DADADA' }}>
                Category
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] border-b" style={{ borderColor: '#DADADA' }}>
                Brand
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[160px] border-b" style={{ borderColor: '#DADADA' }}>
                Product Link
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[140px] border-b" style={{ borderColor: '#DADADA' }}>
                Branding Potential
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] border-b" style={{ borderColor: '#DADADA' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {products.map((product, index) => {
              const isShortlisted = shortlistedProducts.includes(product.id);
              const brandingPotential = calculateBrandingPotential(product.name, product.reviews);
              const productURL = generateProductURL(product);
              const isEven = index % 2 === 0;
              
              return (
                <tr key={product.id} className={`transition-all duration-200 ${
                  isShortlisted 
                    ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm hover:bg-blue-100/50' 
                    : isEven 
                      ? 'bg-white hover:bg-gray-50/50' 
                      : 'bg-gray-50/30 hover:bg-gray-100/50'
                }`} style={{ borderBottom: '1px solid #DADADA', marginBottom: '8px' }}>
                  <td className="px-6 py-6">
                    <div className="max-w-[300px]">
                      <div className="text-sm font-semibold text-gray-900 leading-tight mb-1">
                        {product.name}
                      </div>
                      {product.brand && (
                        <div className="text-xs text-gray-500">by {product.brand}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-lg font-bold text-green-600">
                      ₹{product.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.reviews.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      #{product.bsr}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.weight} kg
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {product.brand || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <a
                      href={productURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-2 h-2 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View on Amazon
                    </a>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      brandingPotential === 'High'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {brandingPotential}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onToggleShortlist(product.id)}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                        isShortlisted
                          ? 'text-white bg-blue-600 hover:bg-blue-700'
                          : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                      }`}
                    >
                        {isShortlisted ? (
                          <>
                            <svg className="w-2 h-2 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Listed
                          </>
                        ) : (
                          <>
                            <svg className="w-2 h-2 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add
                          </>
                        )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </div>
    );
};

export default ProductTable;
