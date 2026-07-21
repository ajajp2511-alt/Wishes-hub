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

// 🗑️ 1. Wish Delete karne ke liye
export async function deleteWishFromDatabase(wishId) {
    const response = await fetch(`/api/manage-wish?id=${wishId}`, {
        method: 'DELETE'
    });
    return await response.json();
}

// ✏️ 2. Wish Edit / Update karne ke liye
export async function updateWishInDatabase(wishId, payload) {
    const response = await fetch(`/api/manage-wish?id=${wishId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return await response.json();
}
