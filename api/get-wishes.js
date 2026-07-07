import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const getFirebaseConfig = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }
  privateKey = privateKey.replace(/\\n/g, '\n');
  return { projectId, clientEmail, privateKey };
};

// Global level par database instance initialize karein taaki freeze na ho
let db;
const config = getFirebaseConfig();

if (!getApps().length && config) {
  try {
    const app = initializeApp({
      credential: cert(config),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    db = getFirestore(app);
  } catch (err) {
    console.error("Initialization failed:", err.message);
  }
} else if (getApps().length) {
  db = getFirestore();
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  if (!db) {
    console.error("🚨 DB Instance is not ready!");
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }

  try {
    console.log("=== CLOUD ENGINE SCAN START ===");
    
    // Simple aur direct collection call bina kisi complex query ke
    const wishesRef = db.collection('wishes');
    const snapshot = await wishesRef.get().catch(err => {
      throw new Error("Firestore Read Timeout/Error: " + err.message);
    });

    console.log(`Documents fetched count: ${snapshot.docs.length}`);

    const wishesList = [];
    snapshot.docs.forEach(doc => {
      wishesList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`=== SCAN COMPLETED. Sending ${wishesList.length} items ===`);
    
    return res.status(200).json({
      success: true,
      wishes: wishesList
    });

  } catch (error) {
    console.error("🚨 CRITICAL ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}
