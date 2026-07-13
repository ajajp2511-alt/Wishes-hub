// Wishes Hub: Local Cache First + YouTube API Fallback Search
// Patel Studio - 2026

import { db } from '../../config/firebaseAdmin'; 

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query parameter is missing' });
  }

  try {
    const cleanQuery = query.trim().toLowerCase();
    let cachedSongs = [];

    // ===================================================
    // STEP 1: FIRESTORE CACHE CHECK (WITH SAFETY TRY)
    // ===================================================
    if (db) {
      try {
        const songCacheRef = db.collection('youtube_songs_cache');
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
      } catch (dbError) {
        console.error("Firestore error ignored to fallback to YouTube:", dbError);
      }
    }

    // ===================================================
    // STEP 2: YOUTUBE API ACCELERATION
    // ===================================================
    const youtubeToken = process.env.YOUTUBE_API_KEY; 
    if (!youtubeToken) {
      return res.status(500).json({ 
        success: false, 
        message: 'SERVER ERROR: YOUTUBE_API_KEY missing in Vercel Environment Variables!' 
      });
    }

    const youtubeIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const urlMatch = query.match(youtubeIdRegex);

    let apiUrl = "";
    if (urlMatch && urlMatch[1]) {
      apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${urlMatch[1]}&key=${youtubeToken}`;
    } else {
      apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&key=${youtubeToken}`;
    }

    const ytResponse = await fetch(apiUrl);
    const ytData = await ytResponse.json();

    if (ytData.error) {
      // Agar API limit ki dikat ho toh fallback database return karo
      if (ytData.error.code === 403 || ytData.error.message.includes('quota')) {
        if (db) {
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
          return res.status(200).json({ source: 'backup_quota_fallback', items: backupSongs });
        }
      }
      return res.status(500).json({ success: false, message: `YouTube API Error: ${ytData.error.message}` });
    }

    return res.status(200).json({ source: 'youtube_api', items: ytData.items || [] });

  } catch (error) {
    return res.status(500).json({ success: false, message: `Server Crash: ${error.message}` });
  }
      }
