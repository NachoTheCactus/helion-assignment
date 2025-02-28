import express from 'express';
import { offerService } from '../services/offerService';

const router = express.Router();

// Get all offers
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    let offers;
    if (status && typeof status === 'string') {
      offers = await offerService.getOffersByStatus(status as any);
    } else {
      offers = await offerService.getAllOffers();
    }
    
    res.json(offers);
  } catch (error) {
    console.error('Error in GET /offers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get offer by ID
router.get('/:id', async (req, res) => {
  try {
    const offer = await offerService.getOfferById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (error) {
    console.error(`Error in GET /offers/${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new offer
router.post('/', async (req, res) => {
  try {
    const offer = await offerService.createOffer(req.body);
    res.status(201).json(offer);
  } catch (error) {
    console.error('Error in POST /offers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update offer
router.put('/:id', async (req, res) => {
  try {
    const offer = await offerService.updateOffer(req.params.id, req.body);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (error) {
    console.error(`Error in PUT /offers/${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update offer status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const offer = await offerService.updateOfferStatus(req.params.id, status);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    res.json(offer);
  } catch (error) {
    console.error(`Error in PATCH /offers/${req.params.id}/status:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete offer
router.delete('/:id', async (req, res) => {
  try {
    const offer = await offerService.deleteOffer(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error(`Error in DELETE /offers/${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;