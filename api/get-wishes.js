import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Safely parsing configuration
const getFirebaseConfig = () => {
  if (!process.env.FIREBASE_MAIN) {
    console.error("Missing FIREBASE_MAIN variable");
    return null;
  }
  try {
    // Agar string format mein hai to parse karega
    const config = typeof process.env.FIREBASE_MAIN === 'string' 
      ? JSON.parse(process.env.FIREBASE_MAIN) 
      : process.env.FIREBASE_MAIN;

    if (config.private_key) {
      config.private_key = config.private_key.replace(/\\n/g, '\n');
    }
    return config;
  } catch (e) {
    console.error("JSON parsing error in FIREBASE_MAIN:", e.message);
    return null;
  }
};

const config = getFirebaseConfig();

if (!getApps().length && config) {
  try {
    initializeApp({
      credential: cert(config),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    console.log("Firebase initialized successfully!");
  } catch (err) {
    console.error("Initialization failed:", err.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Check if SDK loaded properly
  if (getApps().length === 0) {
    return res.status(500).json({ 
      success: false, 
      message: 'Connection Error: Firebase SDK not loaded yet. Check Vercel Env variables.' 
    });
  }

  try {
    const db = getFirestore();
    const wishesRef = db.collection('wishes');
    const snapshot = await wishesRef.orderBy('createdAt', 'desc').get();

    if (snapshot.empty) {
      return res.status(200).json({ success: true, wishes: [] });
    }

    const wishesList = [];
    snapshot.forEach(doc => {
      wishesList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return res.status(200).json({
      success: true,
      wishes: wishesList
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
