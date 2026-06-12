// Is file ka kaam sirf server se baat karna hai
export async function uploadToTelegram(formData) {
    const res = await fetch('/api/upload-to-tg', { method: 'POST', body: formData });
    return await res.json();
}

export async function saveToDatabase(payload) {
    const res = await fetch('/api/add-wish-to-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return await res.json();
}
