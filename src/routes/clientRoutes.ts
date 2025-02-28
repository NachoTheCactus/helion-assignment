import express from 'express';
import { clientService } from '../services/clientService';

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await clientService.getAllClients();
    res.json(clients);
  } catch (error) {
    console.error('Error in GET /clients:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error(`Error in GET /clients/${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new client
router.post('/', async (req, res) => {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    console.error('Error in POST /clients:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error(`Error in PUT /clients/${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const client = await clientService.deleteClient(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error(`Error in DELETE /clients/${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;