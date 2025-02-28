import { API_ENDPOINTS } from './config';
import { apiUtils } from './utils';
import { SalesRepresentative } from '../types';

export const salesRepApi = {
  // Get all sales representatives
  getAllSalesReps: async (): Promise<SalesRepresentative[]> => {
    return apiUtils.get<SalesRepresentative[]>(API_ENDPOINTS.SALES_REPS);
  },

  // Get sales representative by ID
  getSalesRepById: async (id: string): Promise<SalesRepresentative> => {
    return apiUtils.get<SalesRepresentative>(`${API_ENDPOINTS.SALES_REPS}/${id}`);
  },

  // Create new sales representative
  createSalesRep: async (repData: Omit<SalesRepresentative, 'id'>): Promise<SalesRepresentative> => {
    return apiUtils.post<SalesRepresentative>(API_ENDPOINTS.SALES_REPS, repData);
  },

  // Update sales representative
  updateSalesRep: async (id: string, repData: Partial<SalesRepresentative>): Promise<SalesRepresentative> => {
    return apiUtils.put<SalesRepresentative>(`${API_ENDPOINTS.SALES_REPS}/${id}`, repData);
  },

  // Delete sales representative
  deleteSalesRep: async (id: string): Promise<{ message: string }> => {
    return apiUtils.delete<{ message: string }>(`${API_ENDPOINTS.SALES_REPS}/${id}`);
  },
};