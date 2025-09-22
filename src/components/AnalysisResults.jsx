import React from 'react';

const AnalysisResults = ({ analysisData, onClose }) => {
  if (!analysisData) return null;

  const { products, summary, categoryBreakdown } = analysisData;

  // Helper function to generate product URL
  const generateProductURL = (product) => {
    const searchTerm = encodeURIComponent(product.name.substring(0, 50));
    return `https://www.amazon.in/s?k=${searchTerm}&ref=sr_pg_1`;
  };

  // Helper function to determine branding potential
  const getBrandingPotential = (title) => {
    const genericTerms = [
      'bottle', 'cable', 'cover', 'case', 'bag', 'holder', 'stand', 'mount',
      'adapter', 'charger', 'protector', 'screen', 'film', 'strap', 'band',
      'clip', 'hook', 'hanger', 'organizer', 'container', 'box', 'tray',
      'mat', 'pad', 'cushion', 'pillow', 'blanket', 'sheet', 'towel',
      'brush', 'comb', 'sponge', 'cloth', 'wipe', 'cleaner', 'soap',
      'candle', 'light', 'lamp', 'bulb', 'switch', 'plug', 'socket',
      'kit', 'set', 'pack', 'bundle', 'combo', 'collection', 'accessory',
      'tool', 'gadget', 'device', 'equipment', 'supply', 'item'
    ];
    
    const lowerTitle = title.toLowerCase();
    const hasGenericTerms = genericTerms.some(term => lowerTitle.includes(term));
    
    return hasGenericTerms ? 'Low' : 'High';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden my-8 border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Product Analysis Results</h2>
              <p className="text-blue-100 mt-1">
                Found {products.length} products meeting your criteria
              </p>
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

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Summary Cards */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{summary.totalProducts}</div>
                <div className="text-sm text-blue-800">Total Scraped</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{summary.filteredProducts}</div>
                <div className="text-sm text-green-800">Matching Criteria</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{summary.successRate}%</div>
                <div className="text-sm text-purple-800">Success Rate</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{summary.categoriesAnalyzed}</div>
                <div className="text-sm text-orange-800">Categories</div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="text-left p-4 font-bold text-gray-700 uppercase tracking-wider min-w-[200px] border-b" style={{ borderColor: '#DADADA' }}>Product Name</th>
                    <th className="text-left p-4 font-bold text-gray-700 uppercase tracking-wider min-w-[120px] border-b" style={{ borderColor: '#DADADA' }}>Category</th>
                    <th className="text-left p-4 font-bold text-gray-700 uppercase tracking-wider min-w-[80px] border-b" style={{ borderColor: '#DADADA' }}>Price (₹)</th>
                    <th className="text-left p-4 font-bold text-gray-700 uppercase tracking-wider min-w-[80px] border-b" style={{ borderColor: '#DADADA' }}>Reviews</th>
                    <th className="text-left p-4 font-bold text-gray-700 uppercase tracking-wider min-w-[60px] border-b" style={{ borderColor: '#DADADA' }}>BSR</th>
                    <th className="text-left p-4 font-bold text-gray-700 uppercase tracking-wider min-w-[80px] border-b" style={{ borderColor: '#DADADA' }}>Weight</th>
                    <th className="text-left p-4 font-bold text-gray-700 uppercase tracking-wider min-w-[100px] border-b" style={{ borderColor: '#DADADA' }}>Branding</th>
                    <th className="text-left p-4 font-bold text-gray-700 uppercase tracking-wider min-w-[80px] border-b" style={{ borderColor: '#DADADA' }}>Score</th>
                    <th className="text-left p-4 font-bold text-gray-700 uppercase tracking-wider min-w-[120px] border-b" style={{ borderColor: '#DADADA' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id || index} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`} style={{ borderBottom: '1px solid #DADADA' }}>
                      <td className="p-4">
                        <div className="max-w-[200px]">
                          <div className="font-medium text-gray-900 leading-tight mb-1 break-words">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">{product.brand || 'Unknown'}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-green-600">
                        ₹{product.price?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="p-4">{product.reviews?.toLocaleString() || 'N/A'}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          #{product.bsr || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">{product.weight || 'N/A'}kg</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          getBrandingPotential(product.name) === 'Low' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getBrandingPotential(product.name)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          {product.score || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        <a
                          href={generateProductURL(product)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          View on Amazon
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="p-6 border-t bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryBreakdown.map((category, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <div className="font-medium text-gray-900 capitalize">
                    {category.category.replace('-', ' ')}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {category.scraped} scraped, {category.filtered} matching
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(category.filtered / category.scraped) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
