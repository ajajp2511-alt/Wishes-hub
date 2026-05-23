// Step 1: Conversion Logic (Optimized with SessionStorage)
window.resolveTeleImage = async (fileId) => {
    // Check agar link pehle se session mein hai (Speed ke liye)
    const cached = sessionStorage.getItem(fileId);
    if (cached) return cached;

    const res = await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/getFile?file_id=${fileId}`);
    const data = await res.json();
    
    if (data.ok) {
        const fullLink = `https://api.telegram.org/file/bot${process.env.TG_BOT_TOKEN}/${data.result.file_path}`;
        sessionStorage.setItem(fileId, fullLink); // Agli baar ke liye save karein
        return fullLink;
    }
    return "assets/placeholder.png";
};

// Step 2: Render Logic
async function displayWishes(wishes) {
    const grid = document.getElementById('wishes-grid');
    grid.innerHTML = ""; // Clear purana data

    for (let wish of wishes) {
        // ID ko link mein convert karein
        const finalImgUrl = await resolveTeleImage(wish.tgFileId);
        
        grid.innerHTML += `
            <div class="wish-card">
                <img src="${finalImgUrl}" loading="lazy">
                <p>${wish.text}</p>
            </div>`;
    }
}
