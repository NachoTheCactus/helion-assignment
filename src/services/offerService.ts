import Offer, { IOffer, OfferStatus } from '../models/Offer';

export const offerService = {
  // Get all offers with populated client and salesRepresentative fields
  getAllOffers: async (): Promise<IOffer[]> => {
    try {
      return await Offer.find()
        .populate('client')
        .populate('salesRepresentative')
        .sort({ updatedAt: -1 });
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  },

  // Get offers by status
  getOffersByStatus: async (status: OfferStatus): Promise<IOffer[]> => {
    try {
      return await Offer.find({ status })
        .populate('client')
        .populate('salesRepresentative')
        .sort({ updatedAt: -1 });
    } catch (error) {
      console.error(`Error fetching offers with status ${status}:`, error);
      throw error;
    }
  },

  // Get offer by ID
  getOfferById: async (id: string): Promise<IOffer | null> => {
    try {
      return await Offer.findById(id)
        .populate('client')
        .populate('salesRepresentative');
    } catch (error) {
      console.error(`Error fetching offer with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new offer
  createOffer: async (offerData: Partial<IOffer>): Promise<IOffer> => {
    try {
      const offer = new Offer(offerData);
      return await offer.save();
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  },

  // Update offer
  updateOffer: async (id: string, offerData: Partial<IOffer>): Promise<IOffer | null> => {
    try {
      return await Offer.findByIdAndUpdate(id, offerData, { new: true })
        .populate('client')
        .populate('salesRepresentative');
    } catch (error) {
      console.error(`Error updating offer with ID ${id}:`, error);
      throw error;
    }
  },

  // Update offer status
  updateOfferStatus: async (id: string, status: OfferStatus): Promise<IOffer | null> => {
    try {
      return await Offer.findByIdAndUpdate(id, { status }, { new: true })
        .populate('client')
        .populate('salesRepresentative');
    } catch (error) {
      console.error(`Error updating status of offer with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete offer
  deleteOffer: async (id: string): Promise<IOffer | null> => {
    try {
      return await Offer.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting offer with ID ${id}:`, error);
      throw error;
    }
  }
};