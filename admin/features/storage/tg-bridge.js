async function uploadToTelegram(file) {
    const formData = new FormData();
    formData.append('chat_id', process.env.TG_CHAT_ID); // Aapka channel ID
    formData.append('photo', file);

    const response = await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    if (data.ok) {
        // Sabse badi size wali photo ka link nikalna
        const fileId = data.result.photo[data.result.photo.length - 1].file_id;
        
        // Ab hume is File ID ka direct link chahiye
        const getFile = await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/getFile?file_id=${fileId}`);
        const fileData = await getFile.json();
        const filePath = fileData.result.file_path;
        
        return `https://api.telegram.org/file/bot${process.env.TG_BOT_TOKEN}/${filePath}`;
    }
    return null;
}
