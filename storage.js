// --- TELEGRAM CONFIG ---
const TG_BOT_TOKEN = "8183244146:AAGc3zdrTFQBAICK7JEIuDZCQSZB4hHvITg";
const TG_CHAT_ID = "-1003967116090";

// --- PERMANENT UPLOAD LOGIC ---
async function uploadToTelegram(file) {
    if(!file) return "";
    
    let formData = new FormData();
    formData.append("chat_id", TG_CHAT_ID);
    formData.append("photo", file);

    try {
        const res = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendPhoto`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        
        if(data.ok) {
            // Hum Telegram se File ID nikal rahe hain
            return data.result.photo.pop().file_id; 
        } else {
            console.error("Telegram Error:", data.description);
            return "";
        }
    } catch (err) {
        console.error("Upload Error:", err);
        return "";
    }
}

// --- LINK GENERATOR ---
function getTelegramUrl(fileId) {
    if(!fileId) return "https://placehold.co/600x400?text=No+Image";
    // Fresh link mangwane ke liye redirector logic
    return `https://api.telegram.org/file/bot${TG_BOT_TOKEN}/${fileId}`;
}