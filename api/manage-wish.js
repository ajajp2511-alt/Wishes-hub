// Wishes Hub: Edit & Delete API Engine
// Patel Studio - 2026

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const getFirebaseConfig = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) return null;
  privateKey = privateKey.replace(/\\n/g, '\n');
  return { projectId, clientEmail, privateKey };
};

const getDatabaseInstance = () => {
  const config = getFirebaseConfig();
  if (!config) return null;
  try {
    if (getApps().length === 0) {
      const app = initializeApp({
        credential: cert(config),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      return getDatabase(app);
    } else {
      return getDatabase();
    }
  } catch (err) {
    return null;
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDatabaseInstance();
  if (!db) {
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Wish ID is required' });
  }

  const wishRef = db.ref(`wishes/${id}`);

  try {
    if (req.method === 'PUT') {
      const { title, category, sub_category, animation } = req.body;
      const updateData = {};

      if (title !== undefined) updateData.title = title;
      if (category !== undefined) updateData.category = category;
      if (sub_category !== undefined) updateData.sub_category = sub_category;
      if (animation !== undefined) updateData.animation = animation;
      updateData.updatedAt = new Date().toISOString();

      await wishRef.update(updateData);
      return res.status(200).json({ success: true, message: 'Wish updated successfully' });
    } 
    else if (req.method === 'DELETE') {
      await wishRef.remove();
      return res.status(200).json({ success: true, message: 'Wish deleted successfully' });
    } 
    else {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
