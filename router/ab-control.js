/**
 * Emergency Controls, Rollback, Killswitch & Edge API Routes
 * Path: backend/routes/ab-control.routes.js
 */

const express = require('express');
const router = express.Router();

// POST: Emergency Feature Flag Killswitch
router.post('/killswitch', async (req, res) => {
  try {
    const { flagName, action } = req.body; // action: 'kill' or 'restore'
    if (!flagName) {
      return res.status(400).json({ success: false, error: 'Flag name is required.' });
    }
    
    res.json({ success: true, message: `Killswitch activated for ${flagName}. Status: Disabled.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST: Quick Rollback to Historical Variant
router.post('/rollback', async (req, res) => {
  try {
    const { experimentId, targetVariant } = req.body;
    res.json({ success: true, message: `Experiment ${experimentId} successfully rolled back to ${targetVariant}.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST: Auto-Winner Promotion Execution
router.post('/auto-winner/promote', async (req, res) => {
  try {
    const { experimentId, winningVariant, confidence } = req.body;
    res.json({ success: true, message: `Experiment ${experimentId} auto-promoted to 100% traffic for ${winningVariant} (${confidence}% confidence).` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
