import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Safety Check & Initialization
try {
  if (!getApps().length) {
    if (!process.env.FIREBASE_MAIN) {
      throw new Error("Missing FIREBASE_MAIN environment variable in Vercel.");
    }

    // Kuch systems mein private key ke newlines break ho jaate hain, use fix karne ke liye:
    const rawConfig = process.env.FIREBASE_MAIN;
    const firebaseConfig = JSON.parse(rawConfig);
    
    if (firebaseConfig.privateKey) {
      firebaseConfig.privateKey = firebaseConfig.privateKey.replace(/\\n/g, '\n');
    }

    initializeApp({
      credential: cert(firebaseConfig),
      databaseURL: process.env.FIREBASE_DATABASE_URL || undefined
    });
  }
} catch (initError) {
  console.error("Firebase Initialization Failed:", initError.message);
}

// Safely get Firestore instance after initialization
const getDB = () => {
  if (getApps().length === 0) return null;
  return getFirestore();
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const db = getDB();
  if (!db) {
    return res.status(500).json({ 
      success: false, 
      message: 'Firebase DB initialized nahi ho paya. Env Variables check karein.' 
    });
  }

  try {
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
