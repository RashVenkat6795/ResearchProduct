import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for scraping
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Scrape Amazon bestsellers
  async scrapeBestsellers(category = 'all') {
    try {
      console.log(`Scraping bestsellers for category: ${category}`);
      const response = await api.get('/scrape', {
        params: { category }
      });
      return response.data;
    } catch (error) {
      console.error('Scraping failed:', error);
      throw error;
    }
  },

  // Get available categories
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Failed to get categories:', error);
      throw error;
    }
  },

  // Check if server is running
  async isServerRunning() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }
};

export default apiService;
