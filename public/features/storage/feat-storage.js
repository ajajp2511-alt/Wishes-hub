// Step 1: Telegram Image Resolver (Backend API ke zariye)
window.resolveTeleImage = async (fileId) => {
    const cached = sessionStorage.getItem(fileId);
    if (cached) return cached;

    try {
        // Browser mein process.env nahi chalta, isliye /api ka use karein
        const res = await fetch(`/api/get-image?fileId=${fileId}`);
        const data = await res.json();
        
        if (data.url) {
            sessionStorage.setItem(fileId, data.url);
            return data.url;
        }
    } catch (err) {
        console.error("Telegram Image Error:", err);
    }
    return "assets/placeholder.png"; 
};

// Step 2: Render Logic (Screen par dikhana)
async function displayWishes(wishes) {
    const grid = document.getElementById('wishes-grid');
    if (!grid) return;
    
    grid.innerHTML = ""; 

    for (let wish of wishes) {
        const finalImgUrl = await resolveTeleImage(wish.tgFileId);
        
        grid.innerHTML += `
            <div class="wish-card">
                <img src="${finalImgUrl}" loading="lazy" style="width:100%; border-radius:10px;">
                <div class="wish-text" style="margin-top:10px; color:white;">${wish.text}</div>
            </div>`;
    }
}

// Step 3: Initialization (Main Assembly ise call karegi)
async function initStorage() {
    console.log("Fetching wishes from database...");
    try {
        // Yahan Firebase se data lene ka logic (Example data)
        const snapshot = await firebase.firestore().collection('wishes').get();
        const wishes = snapshot.docs.map(doc => doc.data());
        
        if (wishes.length > 0) {
            await displayWishes(wishes);
        } else {
            console.log("No wishes found in DB");
        }
    } catch (error) {
        console.error("Storage Init Error:", error);
    }
}
