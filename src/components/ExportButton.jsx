import React from 'react';
import * as XLSX from 'xlsx';
import { formatCurrency, formatNumber, calculateBrandingPotential } from '../utils/productUtils';

const ExportButton = ({ products, filename = 'products' }) => {
  const exportToCSV = () => {
    const csvData = products.map(product => ({
      'Product Name': product.name,
      'Brand': product.brand,
      'Price (₹)': product.price,
      'Reviews': product.reviews,
      'Best Seller Rank': product.bsr,
      'Weight (kg)': product.weight,
      'Category': product.category,
      'Branding Potential': calculateBrandingPotential(product.name, product.reviews),
      'Is Amazon Launched': product.isAmazonLaunched ? 'Yes' : 'No',
      'Is Fragile': product.isFragile ? 'Yes' : 'No',
      'Is Grocery': product.isGrocery ? 'Yes' : 'No',
      'Has Confusing Sizes': product.hasConfusingSizes ? 'Yes' : 'No',
      'Expiry Date': product.expiryDate || 'N/A'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const excelData = products.map(product => ({
      'Product Name': product.name,
      'Brand': product.brand,
      'Price (₹)': product.price,
      'Reviews': product.reviews,
      'Best Seller Rank': product.bsr,
      'Weight (kg)': product.weight,
      'Category': product.category,
      'Branding Potential': calculateBrandingPotential(product.name, product.reviews),
      'Is Amazon Launched': product.isAmazonLaunched ? 'Yes' : 'No',
      'Is Fragile': product.isFragile ? 'Yes' : 'No',
      'Is Grocery': product.isGrocery ? 'Yes' : 'No',
      'Has Confusing Sizes': product.hasConfusingSizes ? 'Yes' : 'No',
      'Expiry Date': product.expiryDate || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    
    // Auto-size columns
    const colWidths = Object.keys(excelData[0]).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={exportToCSV}
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-semibold transform hover:-translate-y-0.5"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export CSV
      </button>
      
      <button
        onClick={exportToExcel}
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-semibold transform hover:-translate-y-0.5"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Excel
      </button>
    </div>
  );
};

export default ExportButton;
