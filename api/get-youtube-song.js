// Wishes Hub: Local Cache First + YouTube API Fallback Search
// Patel Studio - 2026

import { db } from '../../config/firebaseAdmin'; // Aapke firebase admin sdk initialization ka sahi path yahan check kar lein

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
    
    // Check kar rahe hain ki input koi direct 11-char ki videoId hai ya YouTube URL hai
    const youtubeIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const urlMatch = query.match(youtubeIdRegex);
    
    if (urlMatch && urlMatch[1]) {
      const extractedId = urlMatch[1];
      localSnapshot = await songCacheRef.where('youtubeId', '==', extractedId).limit(5).get();
    } else if (cleanQuery.length === 11 && !cleanQuery.includes(" ")) {
      localSnapshot = await songCacheRef.where('youtubeId', '==', query).limit(5).get();
    } else {
      // Normal text search ke liye searchKeyword match karenge (jo save karte waqt toLowerCase kiya tha)
      localSnapshot = await songCacheRef.where('searchKeyword', '==', cleanQuery).limit(5).get();
    }

    // Agar local database me gaana mil jata hai
    if (localSnapshot && !localSnapshot.empty) {
      const cachedSongs = [];
      localSnapshot.forEach(doc => {
        const data = doc.data();
        cachedSongs.push({
          id: data.youtubeId, // Frontend string condition check handle karne ke liye
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
    const youtubeToken = process.env.YOUTUBE_TOKEN;
    if (!youtubeToken) {
      return res.status(500).json({ success: false, message: 'YouTube Token missing' });
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
      // YouTube quota khatam! Fallback karke Firestore se koi bhi top 5 saved gaane nikalna
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

    // Agar koi dusra technical error ho Google API ka
    if (ytData.error) {
      return res.status(ytData.error.code || 500).json({ success: false, message: ytData.error.message });
    }

    return res.status(200).json({ source: 'youtube_api', items: ytData.items });

  } catch (error) {
    console.error("Error in YouTube handler:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
