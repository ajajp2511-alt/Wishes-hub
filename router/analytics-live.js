import express from 'express';

const router = express.Router();

// GET /api/analytics/live
router.get('/', (req, res) => {
  try {
    const liveData = {
      activeUsers: 142,
      todayWishes: 3840,
      timestamp: new Date().toISOString()
    };
    res.status(200).json({ success: true, data: liveData });
  } catch (error) {
    console.error("Live traffic API error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
});

export default router;
