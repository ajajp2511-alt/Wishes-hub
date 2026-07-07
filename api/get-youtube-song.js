// Wishes Hub: Local Cache First + YouTube API Fallback Search
// Patel Studio - 2026

import { db } from '../../config/firebaseAdmin'; 

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  try {
    const cleanQuery = query.trim().toLowerCase();
    const songCacheRef = db.collection('youtube_songs_cache');

    // ===================================================
    // STEP 1: PEHLE LOCAL DATABASE (FIRESTORE) ME SEARCH KARO
    // ===================================================
    let localSnapshot;
    
    const youtubeIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const urlMatch = query.match(youtubeIdRegex);
    
    if (urlMatch && urlMatch[1]) {
      const extractedId = urlMatch[1];
      localSnapshot = await songCacheRef.where('youtubeId', '==', extractedId).limit(5).get();
    } else if (cleanQuery.length === 11 && !cleanQuery.includes(" ")) {
      localSnapshot = await songCacheRef.where('youtubeId', '==', query).limit(5).get();
    } else {
      localSnapshot = await songCacheRef.where('searchKeyword', '==', cleanQuery).limit(5).get();
    }

    if (localSnapshot && !localSnapshot.empty) {
      const cachedSongs = [];
      localSnapshot.forEach(doc => {
        const data = doc.data();
        cachedSongs.push({
          id: data.youtubeId, 
          snippet: {
            title: data.title,
            thumbnails: { default: { url: data.thumbnail } }
          }
        });
      });
      return res.status(200).json({ source: 'local_collection', items: cachedSongs });
    }

    // ===================================================
    // STEP 2: AGAR LOCAL ME NAHI MILA, TOH YOUTUBE API USE KARO
    // ===================================================
    // 🔥 FIX: Vercel ke variable name ke sath sync kiya
    const youtubeToken = process.env.YOUTUBE_API_KEY; 
    if (!youtubeToken) {
      return res.status(500).json({ success: false, message: 'YouTube Token missing on server configuration' });
    }

    let apiUrl = "";
    if (urlMatch && urlMatch[1]) {
      apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${urlMatch[1]}&key=${youtubeToken}`;
    } else {
      apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&key=${youtubeToken}`;
    }

    const ytResponse = await fetch(apiUrl);
    const ytData = await ytResponse.json();

    // ===================================================
    // STEP 3: CREDIT KHATAM HONE PAR BACKUP HANDLING
    // ===================================================
    if (ytData.error && (ytData.error.code === 403 || ytData.error.message.includes('quota'))) {
      const backupSnapshot = await db.collection('youtube_songs_cache').limit(5).get();
      const backupSongs = [];
      
      backupSnapshot.forEach(doc => {
        const data = doc.data();
        backupSongs.push({
          id: data.youtubeId,
          snippet: {
            title: data.title + " (Saved)",
            thumbnails: { default: { url: data.thumbnail } }
          }
        });
      });

      return res.status(200).json({ 
        source: 'backup_collection_due_to_quota', 
        message: 'YouTube quota exhausted, showing saved collection',
        items: backupSongs
      });
    }

    if (ytData.error) {
      return res.status(ytData.error.code || 500).json({ success: false, message: ytData.error.message });
    }

    return res.status(200).json({ source: 'youtube_api', items: ytData.items });

  } catch (error) {
    console.error("Error in YouTube handler:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
