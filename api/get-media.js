// Wishes Hub: Secure Media Proxy API
// Patel Studio - 2026

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { fileId, type } = req.query;

  if (!fileId) {
    return res.status(400).json({ success: false, message: 'File ID is required' });
  }

  // FIXED: Dono me se jo bhi token Vercel par save ho, use pick kar le (Fallback mechanism)
  const token = process.env.TG_BOT_TOKEN || process.env.TELEGRAM_TOKEN;
  
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
    const fileDownloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

    // 2. Telegram ke server se real media fetch karna
    const mediaResponse = await fetch(fileDownloadUrl);
    
    if (!mediaResponse.ok) {
      throw new Error('Failed to fetch media from Telegram servers');
    }

    // Dynamic type extension checker taaki format crash na ho
    let defaultContentType = 'image/jpeg';
    if (filePath.endsWith('.gif')) defaultContentType = 'image/gif';
    else if (filePath.endsWith('.mp4')) defaultContentType = 'video/mp4';
    else if (type === 'video') defaultContentType = 'video/mp4';

    const contentType = mediaResponse.headers.get('content-type') || defaultContentType;
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache

    const arrayBuffer = await mediaResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return res.send(buffer);

  } catch (error) {
    console.error("Media Proxy Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
