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
  // CORS Headers taaki browser data ko block na kare
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const db = getFirestore();
    const wishesRef = db.collection('wishes');
    
    // Agar 'createdAt' ordering me issue ho, toh pehle bina order ke saari documents utha lete hain
    const snapshot = await wishesRef.get();

    console.log(`=== CLOUD ENGINE SCAN ===`);
    console.log(`Total documents successfully pulled from Firestore: ${snapshot.docs.length}`);

    const wishesList = [];
    
    // Bina kisi filter ke direct array build karein
    snapshot.docs.forEach(doc => {
      const docData = doc.data();
      wishesList.push({
        id: doc.id,
        ...docData
      });
    });

    // 🟢 FORCED VERIFY LOG: Yeh ab har haal me Vercel dashboard par dikhega
    console.log(`Sending Payload to Frontend. Total Items: ${wishesList.length}`);
    if (wishesList.length > 0) {
      console.log("Sample Data Structure Payload:", JSON.stringify(wishesList[0]));
    }

    return res.status(200).json({
      success: true,
      wishes: wishesList
    });

  } catch (error) {
    console.error("🚨 CRITICAL BACKEND ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}
