// Wishes Hub: Realtime Database Fetch Engine
// Patel Studio - 2026

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const getFirebaseConfig = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error("🚨 Missing Firebase Environment Variables!");
    return null;
  }
  
  privateKey = privateKey.replace(/\\n/g, '\n');
  return { projectId, clientEmail, privateKey };
};

// Database Initialization Helper Function (Serverless Safe)
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

  const db = getDatabaseInstance();

  if (!db) {
    console.error("🚨 Realtime DB Instance is not ready!");
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }

  try {
    console.log("=== CLOUD ENGINE SCAN START (REALTIME DATABASE) ===");
    
    const wishesRef = db.ref('wishes');
    const snapshot = await wishesRef.once('value').catch(err => {
      throw new Error("Realtime DB Read Timeout/Error: " + err.message);
    });

    const rawData = snapshot.val();
    const wishesList = [];

    if (rawData) {
      Object.keys(rawData).forEach(key => {
        const item = rawData[key];
        
        // 🛠️ FALLBACK INJECTION: Taaki frontend ko har haal me sahi ID aur image key mile
        wishesList.push({
          id: key,
          ...item,
          title: item.title || item.wishText || '', // Dono keys ko handle kar liya
          image: item.image || item.fileUrl || null // Naye/Purane image formats ke liye safe link
        });
      });

      // Latest updates ko top par lane ke liye sorting
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
