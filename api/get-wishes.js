import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const getFirebaseConfig = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error("Missing Firebase env variables");
    return null;
  }
  privateKey = privateKey.replace(/\\n/g, '\n');
  return { projectId, clientEmail, privateKey };
};

const config = getFirebaseConfig();

if (!getApps().length && config) {
  try {
    initializeApp({
      credential: cert(config),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  } catch (err) {
    console.error("Initialization failed:", err.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const db = getFirestore();
    
    // 🔍 WARNING: Check karein ki Firebase me collection ka naam exact 'wishes' hi hai na?
    const wishesRef = db.collection('wishes');
    const snapshot = await wishesRef.orderBy('createdAt', 'desc').get();

    // 🟢 LOG 1: Check karne ke liye ki total kitne documents mile
    console.log(`Database snapshot received. Total docs found: ${snapshot.size}`);

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

    // 🟢 LOG 2: Pehle item ka data dekhne ke liye fields sahi hain ya nahi
    console.log("First wish item sample structure:", JSON.stringify(wishesList[0]));

    return res.status(200).json({
      success: true,
      wishes: wishesList
    });

  } catch (error) {
    console.error("Backend Handler Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}
