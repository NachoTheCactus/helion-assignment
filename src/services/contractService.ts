import Contract, { IContract, ContractStatus } from '../models/Contract';

export const contractService = {
  // Get all contracts with populated fields
  getAllContracts: async (): Promise<IContract[]> => {
    try {
      return await Contract.find()
        .populate('client')
        .populate('responsiblePerson')
        .populate('relatedOffer')
        .sort({ updatedAt: -1 });
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  },

  // Get contracts by status
  getContractsByStatus: async (status: ContractStatus): Promise<IContract[]> => {
    try {
      return await Contract.find({ status })
        .populate('client')
        .populate('responsiblePerson')
        .populate('relatedOffer')
        .sort({ updatedAt: -1 });
    } catch (error) {
      console.error(`Error fetching contracts with status ${status}:`, error);
      throw error;
    }
  },

  // Get contract by ID
  getContractById: async (id: string): Promise<IContract | null> => {
    try {
      return await Contract.findById(id)
        .populate('client')
        .populate('responsiblePerson')
        .populate('relatedOffer');
    } catch (error) {
      console.error(`Error fetching contract with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new contract
  createContract: async (contractData: Partial<IContract>): Promise<IContract> => {
    try {
      const contract = new Contract(contractData);
      return await contract.save();
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  },

  // Create contract from offer
  createContractFromOffer: async (
    contractData: Partial<IContract>, 
    offerId: string
  ): Promise<IContract> => {
    try {
      const contract = new Contract({
        ...contractData,
        relatedOffer: offerId
      });
      return await contract.save();
    } catch (error) {
      console.error('Error creating contract from offer:', error);
      throw error;
    }
  },

  // Update contract
  updateContract: async (id: string, contractData: Partial<IContract>): Promise<IContract | null> => {
    try {
      return await Contract.findByIdAndUpdate(id, contractData, { new: true })
        .populate('client')
        .populate('responsiblePerson')
        .populate('relatedOffer');
    } catch (error) {
      console.error(`Error updating contract with ID ${id}:`, error);
      throw error;
    }
  },

  // Update contract status
  updateContractStatus: async (id: string, status: ContractStatus): Promise<IContract | null> => {
    try {
      return await Contract.findByIdAndUpdate(id, { status }, { new: true })
        .populate('client')
        .populate('responsiblePerson')
        .populate('relatedOffer');
    } catch (error) {
      console.error(`Error updating status of contract with ID ${id}:`, error);
      throw error;
    }
  },

  // Close contract
  closeContract: async (id: string): Promise<IContract | null> => {
    try {
      return await Contract.findByIdAndUpdate(id, { status: 'Completed' }, { new: true })
        .populate('client')
        .populate('responsiblePerson')
        .populate('relatedOffer');
    } catch (error) {
      console.error(`Error closing contract with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete contract
  deleteContract: async (id: string): Promise<IContract | null> => {
    try {
      return await Contract.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting contract with ID ${id}:`, error);
      throw error;
    }
  }
};