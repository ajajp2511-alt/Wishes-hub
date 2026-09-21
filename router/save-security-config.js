/**
 * Security & Auth Configuration API
 * Path: api/save-security-config.js
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK safely
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
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { policyType, configData, updatedBy } = req.body;

    if (!policyType || !configData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: policyType or configData' 
      });
    }

    const configRef = db.collection('security_configs').doc(policyType);
    await configRef.set({
      ...configData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: updatedBy || 'admin_user',
    }, { merge: true });

    return res.status(200).json({
      success: true,
      message: 'Security configuration saved successfully',
      policyType,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error saving security configuration:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}
