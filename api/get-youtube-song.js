// Wishes Hub: Local Cache First + YouTube API Fallback Search
// Patel Studio - 2026

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
    // STEP 1: SAFE FIRESTORE CACHE CHECK
    // ===================================================
    try {
      // Dynamic import to prevent deployment compile crashes if module behaves strictly
      const firebaseAdmin = require('../../config/firebaseAdmin');
      const db = firebaseAdmin.db;

      if (db) {
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
      }
    } catch (dbError) {
      console.log("Firestore safe bypass execution:", dbError.message);
    }

    // ===================================================
    // STEP 2: YOUTUBE API ACCELERATION
    // ===================================================
    const youtubeToken = process.env.YOUTUBE_API_KEY; 
    if (!youtubeToken) {
      return res.status(200).json({ 
        success: false, 
        message: 'YOUTUBE_API_KEY is missing in Vercel Dashboard Environment Variables!' 
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
      return res.status(200).json({ 
        success: false, 
        message: `YouTube API Key Error: ${ytData.error.message} (Status: ${ytData.error.code})` 
      });
    }

    return res.status(200).json({ success: true, source: 'youtube_api', items: ytData.items || [] });

  } catch (error) {
    return res.status(200).json({ success: false, message: `Server Fallback Crash: ${error.message}` });
  }
        }
