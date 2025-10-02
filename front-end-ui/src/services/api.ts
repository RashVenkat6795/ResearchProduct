const API_BASE_URL = 'http://localhost:3001/api';

export interface Filters {
  minPrice: number;
  maxPrice: number;
  maxReviews: number;
  minBSR: number;
  maxBSR: number;
  maxWeight: number;
  excludeAmazonLaunched: boolean;
  excludeFragile: boolean;
  excludeFood: boolean;
  excludeElectronics: boolean;
  excludeSizeVariations: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  reviews: number;
  bsr: number;
  weight: number;
  category: string;
  brandingPotential: 'Low' | 'Medium' | 'High';
  url: string;
  isAmazonLaunched: boolean;
  isFragile: boolean;
  isFood: boolean;
  isElectronics: boolean;
  hasSizeVariations: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  products?: T[];
  filters?: Filters;
  timestamp: string;
  error?: string;
  message?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getHealth(): Promise<{ status: string; message: string; timestamp: string; version: string; uptime: number }> {
    return this.request('/health');
  }

  async getProducts(filters: Filters): Promise<ApiResponse<Product>> {
    return this.request('/products/filter', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  async getAllProducts(): Promise<ApiResponse<Product>> {
    return this.request('/products/all');
  }

  async getComprehensiveProducts(filters: Filters): Promise<ApiResponse<Product>> {
    return this.request('/products/comprehensive', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  async getCategories(): Promise<{ success: boolean; categories: string[] }> {
    return this.request('/categories');
  }
}

export const apiService = new ApiService();
