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

  // Vercel Dashboard se secure YouTube Token (API KEY) uthana
  const youtubeToken = process.env.YOUTUBE_TOKEN;
  if (!youtubeToken) {
    return res.status(500).json({ success: false, message: 'YouTube Token missing on Vercel' });
  }

  try {
    let apiUrl = "";

    // Check karna ki input YouTube URL hai ya normal search text
    if (query.includes("youtube.com/") || query.includes("youtu.be/")) {
      let videoId = "";
      
      // Regex pattern jo har tarah ke YouTube URL se 11 characters ki accurate video ID nikal leta hai
      const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = query.match(regExp);
      
      if (match && match[1]) {
        videoId = match[1];
      } else {
        return res.status(400).json({ success: false, message: 'Invalid YouTube URL structure' });
      }

      // Specific video ka data nikalne ka URL (URL me hi key attach karni hai)
      apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeToken}`;
    } else {
      // Normal text search ke liye URL (URL me hi key attach karni hai)
      apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&key=${youtubeToken}`;
    }

    // YouTube API ko request bhejna (Headers se Authorization hata diya hai)
    const ytResponse = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const ytData = await ytResponse.json();

    // Agar Google API se koi internal error aaye toh use catch karna
    if (ytData.error) {
      return res.status(ytData.error.code || 500).json({ success: false, message: ytData.error.message });
    }

    return res.status(200).json(ytData);

  } catch (error) {
    console.error("YouTube API Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
