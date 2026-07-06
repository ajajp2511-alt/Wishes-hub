// Wishes Hub: Secure YouTube Audio Search API
// Patel Studio - 2026

export default async function handler(req, res) {
  // Sirf GET requests allowed hain song search ke liye
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Frontend se query parameter (search text ya URL) lena
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Search query or YouTube URL is required' });
  }

  // Vercel Dashboard se secure YouTube Token uthana
  const youtubeToken = process.env.YOUTUBE_TOKEN;
  if (!youtubeToken) {
    return res.status(500).json({ success: false, message: 'YouTube Token missing on Vercel' });
  }

  try {
    let apiUrl = "";

    // Check karna ki input YouTube URL hai ya normal search text
    if (query.includes("youtube.com/") || query.includes("youtu.be/")) {
      let videoId = "";
      if (query.includes("v=")) {
        videoId = query.split("v=")[1].split("&")[0];
      } else if (query.includes("youtu.be/")) {
        videoId = query.split("youtu.be/")[1].split("?")[0];
      }

      // Specific video ka data nikalne ka URL
      apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}`;
    } else {
      // Normal text search ke liye URL (Top 5 video results)
      apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video`;
    }

    // YouTube API ko request bhejna Vercel wale Token ke sath
    const ytResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${youtubeToken}`,
        'Accept': 'application/json'
      }
    });

    const ytData = await ytResponse.json();
    return res.status(200).json(ytData);

  } catch (error) {
    console.error("YouTube API Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
