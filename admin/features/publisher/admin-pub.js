// Feature: Dual Publishing Engine
async function publishNewWish() {
    const wishData = {
        text: document.getElementById('wishInput').value,
        category: document.getElementById('catSelect').value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // 1. Firebase mein save karo (Unlimited Storage)
    const docRef = await db.collection("wishes").add(wishData);

    // 2. Telegram API Trigger (Secure API through folder structure)
    await fetch('/api/upload-handler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: `New Wish: ${wishData.text}`,
            id: docRef.id 
        })
    });

    alert("Published Successfully to Website & Telegram!");
}
