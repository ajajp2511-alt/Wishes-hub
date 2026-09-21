/**
 * Admin Action Audit Logs API
 * Path: api/audit-logs.js
 */

import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
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
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
