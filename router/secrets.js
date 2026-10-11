import express from 'express';

const router = express.Router();

let apiSecrets = [
  { keyId: 'SEC_JWT_MASTER', type: 'JWT Signing Secret', lastRotated: '2026-06-15', status: 'Active' },
  { keyId: 'SEC_HMAC_WEBHOOK', type: 'HMAC Webhook Key', lastRotated: '2026-07-01', status: 'Active' }
];

// GET /api/auth/secrets
router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: apiSecrets });
});

// POST /api/auth/secrets/:id/rotate
router.post('/:id/rotate', (req, res) => {
  const { id } = req.params;
  const secret = apiSecrets.find(s => s.keyId === id);

  if (!secret) {
    return res.status(404).json({ success: false, message: 'API Secret key ID not found.' });
  }

  secret.lastRotated = new Date().toISOString().split('T')[0];
  secret.status = 'Active';

  res.status(200).json({ success: true, message: `Secret key ${id} rotated successfully.`, data: secret });
});

export default router;
