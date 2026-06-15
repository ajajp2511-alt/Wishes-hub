// Wishes Hub: Secure Media Proxy API
// Patel Studio - 2026

export default async function handler(req, res) {
  // Sirf GET requests allowed hain media display ke liye
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Frontend se query parameters me fileId aur type aayenge
  const { fileId, type } = req.query;

  if (!fileId) {
    return res.status(400).json({ success: false, message: 'File ID is required' });
  }

  // Vercel se aapka Telegram Token uthana
  const token = process.env.TELEGRAM_TOKEN;
  if (!token) {
    return res.status(500).json({ success: false, message: 'Telegram Token missing on server' });
  }

  try {
    // 1. Telegram Bot API ko call karke file_path lena
    const fileInfoUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`;
    const infoResponse = await fetch(fileInfoUrl);
    const infoData = await infoResponse.json();

    if (!infoData.ok) {
      throw new Error(infoData.description || 'Telegram API failed to fetch file info');
    }

    const filePath = infoData.result.file_path;
    // Real secure download link jahan humara token use ho raha hai
    const fileDownloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

    // 2. Telegram ke server se real media fetch karna
    const mediaResponse = await fetch(fileDownloadUrl);
    
    if (!mediaResponse.ok) {
      throw new Error('Failed to fetch media from Telegram servers');
    }

    // 3. Browser ko batana ki ye image hai ya video taaki wo sahi se render kare
    const contentType = mediaResponse.headers.get('content-type') || (type === 'video' ? 'video/mp4' : 'image/jpeg');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache taaki bar-bar load na lena pade

    // Data stream ya buffer ko sidhe browser tak pass karna
    const arrayBuffer = await mediaResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return res.send(buffer);

  } catch (error) {
    console.error("Media Proxy Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
