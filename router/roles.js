import express from 'express';

const router = express.Router();

let adminRoles = [
  { id: 'ROLE-01', name: 'Super Admin', permissions: ['ALL'], members: 2 },
  { id: 'ROLE-02', name: 'Content Moderator', permissions: ['WISHES_READ', 'WISHES_DELETE', 'SPAM_FLAG'], members: 5 }
];

// GET /api/auth/roles
router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: adminRoles });
});

// POST /api/auth/roles
router.post('/', (req, res) => {
  const { id, name, permissions } = req.body;
  if (!id || !name) {
    return res.status(400).json({ success: false, message: 'Role ID and name are required.' });
  }

  if (adminRoles.some(r => r.id === id)) {
    return res.status(409).json({ success: false, message: 'Role ID already exists.' });
  }

  const newRole = { id, name, permissions: permissions || ['WISHES_READ'], members: 0 };
  adminRoles.push(newRole);
  res.status(201).json({ success: true, message: 'Role added successfully.', data: newRole });
});

// DELETE /api/auth/roles/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = adminRoles.length;
  adminRoles = adminRoles.filter(r => r.id !== id);

  if (adminRoles.length < initialLen) {
    res.status(200).json({ success: true, message: 'Role removed successfully.' });
  } else {
    res.status(404).json({ success: false, message: 'Role ID not found.' });
  }
});

export default router;
