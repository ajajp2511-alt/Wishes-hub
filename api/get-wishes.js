import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const getFirebaseConfig = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error("🚨 Missing Firebase Environment Variables!");
    return null;
  }
  
  // Handle new lines properly in private key
  privateKey = privateKey.replace(/\\n/g, '\n');
  return { projectId, clientEmail, privateKey };
};

// Database Initialization Helper Function (Serverless Safe)
const getDatabaseInstance = () => {
  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    // Agar koi app initialized nahi hai, toh initialize karein
    if (getApps().length === 0) {
      const app = initializeApp({
        credential: cert(config),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      return getFirestore(app);
    } else {
      // Pehle se initialized app se firestore instance nikaalein
      return getFirestore();
    }
  } catch (err) {
    console.error("🚨 Firebase Initialization failed:", err.message);
    return null;
  }
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Request handle hote waqt DB instance secure karein
  const db = getDatabaseInstance();

  if (!db) {
    console.error("🚨 DB Instance is not ready!");
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }

  try {
    console.log("=== CLOUD ENGINE SCAN START ===");
    
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
