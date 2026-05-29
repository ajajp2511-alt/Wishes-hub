// Step 1: Telegram Image Resolver (Backend API)
window.resolveTeleImage = async (fileId) => {
    // Agar image id nahi hai toh placeholder dikhao
    if (!fileId) return "assets/placeholder.png";

    const cached = sessionStorage.getItem(fileId);
    if (cached) return cached;

    try {
        const res = await fetch(`/api/get-image?fileId=${fileId}`);
        const data = await res.json();
        
        if (data.ok && data.url) {
            sessionStorage.setItem(fileId, data.url);
            return data.url;
        }
    } catch (err) {
        console.error("Telegram Image Fetch Error:", err);
    }
    return "assets/placeholder.png"; 
};

// Step 2: Render Logic (Cards Banane ke liye)
async function displayWishes(wishes) {
    const grid = document.getElementById('wishes-grid');
    if (!grid) return;
    
    grid.innerHTML = ""; 

    // Loop through all wishes
    for (let wish of wishes) {
        // wish.imageUrl agar Firebase mein hai toh use lein, warna Telegram resolve karein
        const finalImgUrl = wish.imageUrl || await window.resolveTeleImage(wish.tgFileId);
        
        grid.innerHTML += `
            <div class="wish-card" style="background:#1a1a1a; padding:15px; border-radius:15px; border:1px solid #333; margin-bottom:15px;">
                <img src="${finalImgUrl}" loading="lazy" style="width:100%; border-radius:10px; min-height:200px; object-fit:cover;">
                <div class="wish-text" style="margin-top:10px; color:#00f2ff; font-weight:bold; font-family:sans-serif;">
                    ${wish.text || "Best Wishes"}
                </div>
            </div>`;
    }
}

// Step 3: Initialization (Database se connect karna)
async function initStorage() {
    console.log("Wishes Hub: Fetching data from Firebase...");
    try {
        // Firebase check karein
        if (typeof firebase === 'undefined') {
            throw new Error("Firebase SDK not loaded yet.");
        }

        const db = firebase.firestore();
        // 'wishes' collection se data mangwayein
        const snapshot = await db.collection('wishes').get();
        
        const wishes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        if (wishes.length > 0) {
            console.log(`${wishes.length} wishes found.`);
            await displayWishes(wishes);
        } else {
            console.warn("No wishes found in 'wishes' collection.");
            document.getElementById('wishes-grid').innerHTML = "<p style='color:white; text-align:center;'>No wishes available yet.</p>";
        }
    } catch (error) {
        console.error("Storage Module Error:", error);
        const grid = document.getElementById('wishes-grid');
        if(grid) grid.innerHTML = `<p style='color:red;'>Connection Error: ${error.message}</p>`;
    }
}
