import { API_ENDPOINTS } from './config';
import { apiUtils } from './utils';
import { Contract, ContractStatus } from '../types';

export const contractApi = {
  // Get all contracts
  getAllContracts: async (): Promise<Contract[]> => {
    return apiUtils.get<Contract[]>(API_ENDPOINTS.CONTRACTS);
  },

  // Get contracts by status
  getContractsByStatus: async (status: ContractStatus): Promise<Contract[]> => {
    return apiUtils.get<Contract[]>(`${API_ENDPOINTS.CONTRACTS}?status=${status}`);
  },

  // Get contract by ID
  getContractById: async (id: string): Promise<Contract> => {
    return apiUtils.get<Contract>(`${API_ENDPOINTS.CONTRACTS}/${id}`);
  },

  // Create new contract
  createContract: async (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract> => {
    return apiUtils.post<Contract>(API_ENDPOINTS.CONTRACTS, contractData);
  },

  // Create contract from offer
  createContractFromOffer: async (
    contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>,
    offerId: string
  ): Promise<Contract> => {
    return apiUtils.post<Contract>(
      `${API_ENDPOINTS.CONTRACTS}/from-offer/${offerId}`,
      contractData
    );
  },

  // Update contract
  updateContract: async (id: string, contractData: Partial<Contract>): Promise<Contract> => {
    return apiUtils.put<Contract>(`${API_ENDPOINTS.CONTRACTS}/${id}`, contractData);
  },

  // Update contract status
  updateContractStatus: async (id: string, status: ContractStatus): Promise<Contract> => {
    return apiUtils.patch<Contract>(`${API_ENDPOINTS.CONTRACTS}/${id}/status`, { status });
  },

  // Close contract
  closeContract: async (id: string): Promise<Contract> => {
    return apiUtils.patch<Contract>(`${API_ENDPOINTS.CONTRACTS}/${id}/close`, {});
  },

  // Delete contract
  deleteContract: async (id: string): Promise<{ message: string }> => {
    return apiUtils.delete<{ message: string }>(`${API_ENDPOINTS.CONTRACTS}/${id}`);
  },
};