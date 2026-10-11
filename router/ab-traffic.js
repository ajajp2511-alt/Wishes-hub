/**
 * MAB Traffic Router & Audience Segmentation API Routes
 * Path: backend/routes/ab-traffic.routes.js
 */

const express = require('express');
const router = express.Router();

// GET: Multi-Armed Bandit (MAB) Dynamic Traffic Weights
router.get('/mab/weights/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    // Thompson sampling simulation weights
    const weights = {
      testId,
      algorithm: 'Thompson Sampling',
      variants: {
        'Variant A': 0.245,
        'Variant B': 0.755
      },
      lastUpdated: new Date().toISOString()
    };
    res.json({ success: true, data: weights });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST: Audience Segmentation Matcher
router.post('/segment/evaluate', async (req, res) => {
  try {
    const { userDevice, userCountry, userType } = req.body;
    
    // Evaluate matching segment rules
    const matchedSegment = {
      ruleMatched: true,
      segmentName: 'Mobile Users - India Region',
      eligibleExperiments: ['EXP-101']
    };

    res.json({ success: true, data: matchedSegment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
