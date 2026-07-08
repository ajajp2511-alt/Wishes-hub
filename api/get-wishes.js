import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database'; // 🟢 Change: Firestore ki jagah Realtime Database standard import kiya

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
        databaseURL: process.env.FIREBASE_DATABASE_URL // 🟢 Ensure databaseURL perfectly assigned ho (.env file mein)
      });
      return getDatabase(app); // 🟢 Return Realtime Database Instance
    } else {
      return getDatabase(); // 🟢 Return Pre-initialized Realtime Database Instance
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

  // Request handle hote waqt Realtime DB instance secure karein
  const db = getDatabaseInstance();

  if (!db) {
    console.error("🚨 Realtime DB Instance is not ready!");
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }

  try {
    console.log("=== CLOUD ENGINE SCAN START (REALTIME DATABASE) ===");
    
    // Admin backend me data 'wishes' node par push hota hai
    const wishesRef = db.ref('wishes');
    
    // Realtime Database data snapshot read snapshot pipeline
    const snapshot = await wishesRef.once('value').catch(err => {
      throw new Error("Realtime DB Read Timeout/Error: " + err.message);
    });

    const rawData = snapshot.val();
    const wishesList = [];

    if (rawData) {
      // JSON Object data map ko array format me bundle karein
      Object.keys(rawData).forEach(key => {
        wishesList.push({
          id: key,
          ...rawData[key]
        });
      });

      // 🔴 CRITICAL ADDITION FOR USER EXPERIENCE: 
      // Nayi uploads (latest updates) ko User panel par sabse pehle (top par) lane ke liye sort kiya
      wishesList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    console.log(`=== SCAN COMPLETED. Sending ${wishesList.length} items from Realtime DB ===`);
    
    return res.status(200).json({
      success: true,
      wishes: wishesList
    });

  } catch (error) {
    console.error("🚨 CRITICAL ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}
