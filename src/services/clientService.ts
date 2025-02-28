import Client, { IClient } from '../models/Client';

export const clientService = {
  // Get all clients
  getAllClients: async (): Promise<IClient[]> => {
    try {
      return await Client.find().sort({ name: 1 });
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Get client by ID
  getClientById: async (id: string): Promise<IClient | null> => {
    try {
      return await Client.findById(id);
    } catch (error) {
      console.error(`Error fetching client with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new client
  createClient: async (clientData: Partial<IClient>): Promise<IClient> => {
    try {
      const client = new Client(clientData);
      return await client.save();
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  // Update client
  updateClient: async (id: string, clientData: Partial<IClient>): Promise<IClient | null> => {
    try {
      return await Client.findByIdAndUpdate(id, clientData, { new: true });
    } catch (error) {
      console.error(`Error updating client with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete client
  deleteClient: async (id: string): Promise<IClient | null> => {
    try {
      return await Client.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting client with ID ${id}:`, error);
      throw error;
    }
  }
};