// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Default API request headers
export const defaultHeaders = {
  'Content-Type': 'application/json'
};

// API endpoints
export const API_ENDPOINTS = {
  CLIENTS: `${API_BASE_URL}/clients`,
  SALES_REPS: `${API_BASE_URL}/sales-reps`,
  OFFERS: `${API_BASE_URL}/offers`,
  CONTRACTS: `${API_BASE_URL}/contracts`,
  HEALTH: `${API_BASE_URL}/health`,
};