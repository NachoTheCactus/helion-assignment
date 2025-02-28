import { API_ENDPOINTS } from './config';
import { apiUtils } from './utils';
import { Client } from '../types';

export const clientApi = {
  // Get all clients
  getAllClients: async (): Promise<Client[]> => {
    return apiUtils.get<Client[]>(API_ENDPOINTS.CLIENTS);
  },

  // Get client by ID
  getClientById: async (id: string): Promise<Client> => {
    return apiUtils.get<Client>(`${API_ENDPOINTS.CLIENTS}/${id}`);
  },

  // Create new client
  createClient: async (clientData: Omit<Client, 'id'>): Promise<Client> => {
    return apiUtils.post<Client>(API_ENDPOINTS.CLIENTS, clientData);
  },

  // Update client
  updateClient: async (id: string, clientData: Partial<Client>): Promise<Client> => {
    return apiUtils.put<Client>(`${API_ENDPOINTS.CLIENTS}/${id}`, clientData);
  },

  // Delete client
  deleteClient: async (id: string): Promise<{ message: string }> => {
    return apiUtils.delete<{ message: string }>(`${API_ENDPOINTS.CLIENTS}/${id}`);
  },
};