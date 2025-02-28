import { API_ENDPOINTS } from './config';
import { apiUtils } from './utils';
import { Offer, OfferStatus } from '../types';

export const offerApi = {
  // Get all offers
  getAllOffers: async (): Promise<Offer[]> => {
    return apiUtils.get<Offer[]>(API_ENDPOINTS.OFFERS);
  },

  // Get offers by status
  getOffersByStatus: async (status: OfferStatus): Promise<Offer[]> => {
    return apiUtils.get<Offer[]>(`${API_ENDPOINTS.OFFERS}?status=${status}`);
  },

  // Get offer by ID
  getOfferById: async (id: string): Promise<Offer> => {
    return apiUtils.get<Offer>(`${API_ENDPOINTS.OFFERS}/${id}`);
  },

  // Create new offer
  createOffer: async (offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Offer> => {
    return apiUtils.post<Offer>(API_ENDPOINTS.OFFERS, offerData);
  },

  // Update offer
  updateOffer: async (id: string, offerData: Partial<Offer>): Promise<Offer> => {
    return apiUtils.put<Offer>(`${API_ENDPOINTS.OFFERS}/${id}`, offerData);
  },

  // Update offer status
  updateOfferStatus: async (id: string, status: OfferStatus): Promise<Offer> => {
    return apiUtils.patch<Offer>(`${API_ENDPOINTS.OFFERS}/${id}/status`, { status });
  },

  // Delete offer
  deleteOffer: async (id: string): Promise<{ message: string }> => {
    return apiUtils.delete<{ message: string }>(`${API_ENDPOINTS.OFFERS}/${id}`);
  },
};