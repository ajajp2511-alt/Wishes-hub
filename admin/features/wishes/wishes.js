// admin/features/wishes/wishes.js

window.uploadToTelegram = async function(formData) {
    const res = await fetch('/api/upload-to-tg', { method: 'POST', body: formData });
    
    // Check karein ki response sahi hai ya nahi
    const contentType = res.headers.get("content-type");
    if (!res.ok || (contentType && !contentType.includes("application/json"))) {
        const errorText = await res.text();
        throw new Error(`Server Error (${res.status}): ${errorText.substring(0, 100)}`);
    }
    
    return await res.json();
};

window.saveToDatabase = async function(payload) {
    const res = await fetch('/api/add-wish-to-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    const contentType = res.headers.get("content-type");
    if (!res.ok || (contentType && !contentType.includes("application/json"))) {
        const errorText = await res.text();
        throw new Error(`DB Server Error (${res.status}): ${errorText.substring(0, 100)}`);
    }

    return await res.json();
};
