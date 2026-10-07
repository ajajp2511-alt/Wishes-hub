/**
 * Admin Action Audit Logs Router
 * Path: router/audit-logs.js
 */

import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();

if (!admin.apps.length) {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  
  // Clean potential quotes and format newlines properly
  privateKey = privateKey.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = admin.firestore();

router.post('/audit-logs', async (req, res) => {
  try {
    const { adminUser, action, details } = req.body;

    await db.collection('audit_logs').add({
      adminUser: adminUser || 'system',
      action: action || 'UNKNOWN_ACTION',
      details: details || {},
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ success: true, message: 'Audit log recorded' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
