import express from 'express';

const router = express.Router();

// GET /api/analytics/performance
router.get('/', (req, res) => {
  try {
    const performanceData = {
      apiLatency: '42 ms',
      cdnSpeed: '18 ms',
      lcp: '0.8 s (Good)',
      day7Retention: '32.4%',
      returningUsersRatio: '44.1%'
    };
    res.status(200).json({ success: true, data: performanceData });
  } catch (error) {
    console.error("Performance monitor API error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
});

export default router;
