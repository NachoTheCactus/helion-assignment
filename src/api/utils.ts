import { defaultHeaders } from './config';

// Type for API request options
type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  body?: any;
};

// Generic fetch function
export const fetchApi = async <T>(url: string, options: RequestOptions): Promise<T> => {
  try {
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    const fetchOptions: RequestInit = {
      method: options.method,
      headers,
    };

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, fetchOptions);

    // Check if response is OK
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API request failed with status ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Generic API methods
export const apiUtils = {
  get: <T>(url: string, customHeaders?: HeadersInit): Promise<T> => {
    return fetchApi<T>(url, {
      method: 'GET',
      headers: customHeaders,
    });
  },

  post: <T>(url: string, body: any, customHeaders?: HeadersInit): Promise<T> => {
    return fetchApi<T>(url, {
      method: 'POST',
      headers: customHeaders,
      body,
    });
  },

  put: <T>(url: string, body: any, customHeaders?: HeadersInit): Promise<T> => {
    return fetchApi<T>(url, {
      method: 'PUT',
      headers: customHeaders,
      body,
    });
  },

  patch: <T>(url: string, body: any, customHeaders?: HeadersInit): Promise<T> => {
    return fetchApi<T>(url, {
      method: 'PATCH',
      headers: customHeaders,
      body,
    });
  },

  delete: <T>(url: string, customHeaders?: HeadersInit): Promise<T> => {
    return fetchApi<T>(url, {
      method: 'DELETE',
      headers: customHeaders,
    });
  },
};