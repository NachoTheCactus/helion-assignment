import SalesRepresentative, { ISalesRepresentative } from '../models/SalesRepresentative';

export const salesRepService = {
  // Get all sales representatives
  getAllSalesReps: async (): Promise<ISalesRepresentative[]> => {
    try {
      return await SalesRepresentative.find().sort({ name: 1 });
    } catch (error) {
      console.error('Error fetching sales representatives:', error);
      throw error;
    }
  },

  // Get sales representative by ID
  getSalesRepById: async (id: string): Promise<ISalesRepresentative | null> => {
    try {
      return await SalesRepresentative.findById(id);
    } catch (error) {
      console.error(`Error fetching sales representative with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new sales representative
  createSalesRep: async (repData: Partial<ISalesRepresentative>): Promise<ISalesRepresentative> => {
    try {
      const salesRep = new SalesRepresentative(repData);
      return await salesRep.save();
    } catch (error) {
      console.error('Error creating sales representative:', error);
      throw error;
    }
  },

  // Update sales representative
  updateSalesRep: async (id: string, repData: Partial<ISalesRepresentative>): Promise<ISalesRepresentative | null> => {
    try {
      return await SalesRepresentative.findByIdAndUpdate(id, repData, { new: true });
    } catch (error) {
      console.error(`Error updating sales representative with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete sales representative
  deleteSalesRep: async (id: string): Promise<ISalesRepresentative | null> => {
    try {
      return await SalesRepresentative.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting sales representative with ID ${id}:`, error);
      throw error;
    }
  }
};