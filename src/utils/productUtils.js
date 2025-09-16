// Utility functions for product filtering and branding potential calculation

// Calculate branding potential based on product title
export const calculateBrandingPotential = (productName, reviews) => {
  // Generic terms that indicate low branding potential
  const genericTerms = [
    'bottle', 'cable', 'cover', 'case', 'adapter', 'charger', 'holder',
    'stand', 'mount', 'grip', 'protector', 'screen guard', 'tempered glass',
    'cable', 'wire', 'cord', 'plug', 'socket', 'extension', 'splitter',
    'hub', 'dock', 'station', 'base', 'support', 'bracket', 'clamp',
    'strap', 'band', 'chain', 'ring', 'hook', 'clip', 'pin', 'button'
  ];

  // Check if product name contains generic terms
  const nameLower = productName.toLowerCase();
  const hasGenericTerms = genericTerms.some(term => nameLower.includes(term));

  // If reviews < 500, branding potential is low regardless
  if (reviews < 500) {
    return 'Low';
  }

  // If has generic terms, low branding potential
  if (hasGenericTerms) {
    return 'Low';
  }

  return 'High';
};

// Main filtering function based on requirements
export const filterProducts = (products) => {
  return products.filter(product => {
    // Exclude Amazon Launched or Amazon Renewed products
    if (product.isAmazonLaunched) {
      return false;
    }

    // Exclude fragile items (glass, ceramic)
    if (product.isFragile) {
      return false;
    }

    // Exclude grocery items with expiry < 6 months
    if (product.isGrocery && product.expiryDate) {
      const expiryDate = new Date(product.expiryDate);
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      
      if (expiryDate < sixMonthsFromNow) {
        return false;
      }
    }

    // Exclude products with confusing size variations only
    if (product.hasConfusingSizes) {
      return false;
    }

    // Keep products if they meet the criteria:
    // Price between ₹500 – ₹2000
    if (product.price < 500 || product.price > 2000) {
      return false;
    }

    // Reviews < 300
    if (product.reviews >= 300) {
      return false;
    }

    // Best Seller Rank (BSR) between 200–2000
    if (product.bsr < 200 || product.bsr > 2000) {
      return false;
    }

    // Weight < 1 kg
    if (product.weight >= 1) {
      return false;
    }

    return true;
  });
};

// Apply additional filters based on user input
export const applyUserFilters = (products, filters) => {
  let filtered = [...products];

  // Price range filter
  if (filters.minPrice !== null) {
    filtered = filtered.filter(product => product.price >= filters.minPrice);
  }
  if (filters.maxPrice !== null) {
    filtered = filtered.filter(product => product.price <= filters.maxPrice);
  }

  // BSR range filter
  if (filters.minBsr !== null) {
    filtered = filtered.filter(product => product.bsr >= filters.minBsr);
  }
  if (filters.maxBsr !== null) {
    filtered = filtered.filter(product => product.bsr <= filters.maxBsr);
  }

  // Reviews filter
  if (filters.maxReviews !== null) {
    filtered = filtered.filter(product => product.reviews <= filters.maxReviews);
  }

  // Weight filter
  if (filters.maxWeight !== null) {
    filtered = filtered.filter(product => product.weight <= filters.maxWeight);
  }

  // Category filter
  if (filters.category && filters.category !== 'All') {
    filtered = filtered.filter(product => product.category === filters.category);
  }

  // Branding potential filter
  if (filters.brandingPotential && filters.brandingPotential !== 'All') {
    filtered = filtered.filter(product => {
      const branding = calculateBrandingPotential(product.name, product.reviews);
      return branding === filters.brandingPotential;
    });
  }

  return filtered;
};

// Get unique categories from products
export const getUniqueCategories = (products) => {
  const categories = [...new Set(products.map(product => product.category))];
  return ['All', ...categories.sort()];
};

// Format currency for Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};
