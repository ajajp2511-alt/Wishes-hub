export async function uploadMediaToTelegram(formData) {
    const response = await fetch('/api/upload-to-tg', { method: 'POST', body: formData });
    return await response.json();
}

export async function saveWishToDatabase(payload) {
    const response = await fetch('/api/add-wish-to-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return await response.json();
}
