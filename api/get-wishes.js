import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Alag-alag environment variables se config banana
const getFirebaseConfig = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error("Missing one or more Firebase environment variables");
    return null;
  }

  // Private key ke \n (newlines) ko fix karna
  privateKey = privateKey.replace(/\\n/g, '\n');

  return {
    projectId,
    clientEmail,
    privateKey
  };
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
    // 🟢 FIXED: Vercel aur Browser caching ko rokne ke liye headers
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

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
