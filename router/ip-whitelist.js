import express from 'express';

const router = express.Router();

let ipWhitelist = [
  { id: 'IP-01', ipRange: '192.168.1.0/24', label: 'Office Primary Network', status: 'Whitelisted' },
  { id: 'IP-02', ipRange: '49.36.210.12', label: 'DevOps Fixed VPN Gateway', status: 'Whitelisted' }
];

// GET /api/auth/ip-whitelist
router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: ipWhitelist });
});

// POST /api/auth/ip-whitelist
router.post('/', (req, res) => {
  const { id, ipRange, label } = req.body;
  if (!id || !ipRange) {
    return res.status(400).json({ success: false, message: 'IP entry ID and range are required.' });
  }

  const newEntry = { id, ipRange, label: label || 'Custom IP', status: 'Whitelisted' };
  ipWhitelist.push(newEntry);
  res.status(201).json({ success: true, message: 'IP range whitelisted successfully.', data: newEntry });
});

// DELETE /api/auth/ip-whitelist/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = ipWhitelist.length;
  ipWhitelist = ipWhitelist.filter(ip => ip.id !== id);

  if (ipWhitelist.length < initialLen) {
    res.status(200).json({ success: true, message: 'IP rule revoked successfully.' });
  } else {
    res.status(404).json({ success: false, message: 'IP rule ID not found.' });
  }
});

export default router;
