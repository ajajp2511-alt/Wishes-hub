// admin/features/wishes/wishes.js

// 1. Telegram upload function (Direct window scope)
window.uploadToTelegram = async function(formData) {
    const res = await fetch('/api/upload-to-tg', { method: 'POST', body: formData });
    return await res.json();
};

// 2. Database save function (Direct window scope)
window.saveToDatabase = async function(payload) {
    const res = await fetch('/api/add-wish-to-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return await res.json();
};
