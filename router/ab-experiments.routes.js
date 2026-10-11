/**
 * A/B Experiments & Layout Variants API Routes
 * Path: backend/routes/ab-experiments.routes.js
 */

const express = require('express');
const router = express.Router();

// Mock database or core service reference
// const abc-core = require('../services/ab-core.service');

// GET: Fetch all active experiments & UI variants
router.get('/experiments', async (req, res) => {
  try {
    // Replace with actual database fetch
    const experiments = [
      { id: 'EXP-101', name: 'Hero CTA Button Color', variantA: 'Green', variantB: 'Orange', split: '50/50', status: 'Running' }
    ];
    res.json({ success: true, data: experiments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST: Create new A/B or MVT test variant
router.post('/experiments', async (req, res) => {
  try {
    const { name, variantA, variantB, split, type } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Experiment name is required.' });
    }
    
    const newTest = {
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      name,
      variantA,
      variantB,
      split: split || '50/50',
      type: type || 'AB',
      status: 'Running',
      createdAt: new Date().toISOString()
    };

    // Save to DB logic here...
    res.status(201).json({ success: true, message: 'Experiment created successfully', data: newTest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH: Pause or update experiment status
router.patch('/experiments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Running', 'Paused', 'Completed'
    
    res.json({ success: true, message: `Experiment ${id} status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
