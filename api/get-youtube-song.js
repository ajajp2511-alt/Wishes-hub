// Wishes Hub: Local Cache First + YouTube API Fallback Search
// Patel Studio - 2026

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  try {
    // ==========================================
    // STEP 1: PEHLE LOCAL DATABASE (COLLECTION) ME SEARCH KARO
    // ==========================================
    // (Aap jo bhi DB use kar rahe hain, jaise Firebase/MongoDB)
    // const localResults = await db.collection('youtube_songs_cache').find({ 
    //    $or: [ { title: new RegExp(query, 'i') }, { youtubeId: query } ] 
    // }).limit(5);

    const localResults = []; // Yeh temporary hai, yahan DB check ka logic aayega

    if (localResults && localResults.length > 0) {
      // Agar local collection me gaana mil gaya, toh directly return kar do!
      return res.status(200).json({ source: 'local_collection', items: localResults });
    }

    // ==========================================
    // STEP 2: AGAR LOCAL ME NAHI MILA, TOH YOUTUBE API USE KARO
    // ==========================================
    const youtubeToken = process.env.YOUTUBE_TOKEN;
    if (!youtubeToken) {
      return res.status(500).json({ success: false, message: 'YouTube Token missing' });
    }

    let apiUrl = "";
    // URL vs Text search condition (Jaise humne pehle fix kiya tha)
    if (query.includes("youtube.com/") || query.includes("youtu.be/")) {
      // Extract videoId logic...
      apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeToken}`;
    } else {
      apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&key=${youtubeToken}`;
    }

    const ytResponse = await fetch(apiUrl);
    const ytData = await ytResponse.json();

    // ==========================================
    // STEP 3: CREDIT KHATAM HONE PAR BACKUP HANDLING
    // ==========================================
    if (ytData.error && (ytData.error.statusCode === 403 || ytData.error.message.includes('quota'))) {
      // YouTube ka credit khatam! Ab fallback karo aur database ke popular songs dikha do
      // const backupSongs = await db.collection('youtube_songs_cache').find().limit(5);
      return res.status(200).json({ 
        source: 'backup_collection_due_to_quota', 
        message: 'YouTube quota exhausted, showing saved collection',
        items: [] // backupSongs yahan pass honge
      });
    }

    return res.status(200).json({ source: 'youtube_api', items: ytData.items });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
