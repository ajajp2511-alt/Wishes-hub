import express from 'express';

const router = express.Router();

// GET /api/analytics/geo-insights
router.get('/', (req, res) => {
  try {
    const topStates = [
      { state: 'Maharashtra', count: '38%' },
      { state: 'Gujarat', count: '24%' },
      { state: 'Uttar Pradesh', count: '18%' }
    ];
    res.status(200).json({ success: true, data: topStates });
  } catch (error) {
    console.error("Geo insights API error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
});

export default router;
