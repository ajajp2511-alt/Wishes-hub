// Step 1: Image upload logic
async function uploadToTelegramAndGetID(file) {
    const formData = new FormData();
    formData.append('chat_id', process.env.TG_CHAT_ID);
    formData.append('photo', file);

    const response = await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    if (data.ok) {
        // Yeh File ID hum Firebase mein save karenge
        return data.result.photo[data.result.photo.length - 1].file_id;
    }
    return null;
}

// Step 2: Firebase mein save karne ka main function
async function handlePublish() {
    const text = document.getElementById('wish-text').value;
    const file = document.getElementById('image-input').files[0];

    const tgFileId = await uploadToTelegramAndGetID(file);

    if (tgFileId) {
        await db.collection("wishes").add({
            text: text,
            tgFileId: tgFileId, // Sirf ID save ho rahi hai
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast("Published! Image Telegram par aur ID Firebase mein save ho gayi.");
    }
}
