import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Initialization using Vercel Environment Variables
const firebaseConfig = JSON.parse(process.env.FIREBASE_MAIN); 
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  // Sirf GET request allowed hai data fetch karne ke liye
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // Firestore ke 'wishes' collection se latest data nikalna
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

    // Pura clean data frontend ko respond karna
    return res.status(200).json({
      success: true,
      wishes: wishesList
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
