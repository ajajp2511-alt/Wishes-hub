import express from 'express';

const router = express.Router();

// GET /api/analytics/shares
router.get('/', (req, res) => {
  try {
    const shareData = {
      whatsappShares: 2910,
      telegramShares: 1420,
      directLinkShares: 890
    };
    res.status(200).json({ success: true, data: shareData });
  } catch (error) {
    console.error("Share attribution API error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
});

export default router;
