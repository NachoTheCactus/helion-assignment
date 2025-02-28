import express from 'express';
import { contractService } from '../services/contractService';

const router = express.Router();

// Get all contracts
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    let contracts;
    if (status && typeof status === 'string') {
      contracts = await contractService.getContractsByStatus(status as any);
    } else {
      contracts = await contractService.getAllContracts();
    }
    
    res.json(contracts);
  } catch (error) {
    console.error('Error in GET /contracts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contract by ID
router.get('/:id', async (req, res) => {
  try {
    const contract = await contractService.getContractById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json(contract);
  } catch (error) {
    console.error(`Error in GET /contracts/${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new contract
router.post('/', async (req, res) => {
  try {
    const contract = await contractService.createContract(req.body);
    res.status(201).json(contract);
  } catch (error) {
    console.error('Error in POST /contracts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create contract from offer
router.post('/from-offer/:offerId', async (req, res) => {
  try {
    const { offerId } = req.params;
    const contract = await contractService.createContractFromOffer(req.body, offerId);
    res.status(201).json(contract);
  } catch (error) {
    console.error(`Error in POST /contracts/from-offer/${req.params.offerId}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contract
router.put('/:id', async (req, res) => {
  try {
    const contract = await contractService.updateContract(req.params.id, req.body);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json(contract);
  } catch (error) {
    console.error(`Error in PUT /contracts/${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contract status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const contract = await contractService.updateContractStatus(req.params.id, status);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    
    res.json(contract);
  } catch (error) {
    console.error(`Error in PATCH /contracts/${req.params.id}/status:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Close contract
router.patch('/:id/close', async (req, res) => {
  try {
    const contract = await contractService.closeContract(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    
    res.json(contract);
  } catch (error) {
    console.error(`Error in PATCH /contracts/${req.params.id}/close:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contract
router.delete('/:id', async (req, res) => {
  try {
    const contract = await contractService.deleteContract(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    console.error(`Error in DELETE /contracts/${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;