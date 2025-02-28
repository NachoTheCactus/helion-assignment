import express from 'express';
import { salesRepService } from '../services/salesRepService';

const router = express.Router();

// Get all sales representatives
router.get('/', async (req, res) => {
  try {
    const salesReps = await salesRepService.getAllSalesReps();
    res.json(salesReps);
  } catch (error) {
    console.error('Error in GET /sales-reps:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sales representative by ID
router.get('/:id', async (req, res) => {
  try {
    const salesRep = await salesRepService.getSalesRepById(req.params.id);
    if (!salesRep) {
      return res.status(404).json({ message: 'Sales representative not found' });
    }
    res.json(salesRep);
  } catch (error) {
    console.error(`Error in GET /sales-reps/${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new sales representative
router.post('/', async (req, res) => {
  try {
    const salesRep = await salesRepService.createSalesRep(req.body);
    res.status(201).json(salesRep);
  } catch (error) {
    console.error('Error in POST /sales-reps:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update sales representative
router.put('/:id', async (req, res) => {
  try {
    const salesRep = await salesRepService.updateSalesRep(req.params.id, req.body);
    if (!salesRep) {
      return res.status(404).json({ message: 'Sales representative not found' });
    }
    res.json(salesRep);
  } catch (error) {
    console.error(`Error in PUT /sales-reps/${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete sales representative
router.delete('/:id', async (req, res) => {
  try {
    const salesRep = await salesRepService.deleteSalesRep(req.params.id);
    if (!salesRep) {
      return res.status(404).json({ message: 'Sales representative not found' });
    }
    res.json({ message: 'Sales representative deleted successfully' });
  } catch (error) {
    console.error(`Error in DELETE /sales-reps/${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;