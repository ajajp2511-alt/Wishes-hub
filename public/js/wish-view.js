// ==========================================================
// 🌐 WISHES HUB USER PANEL - DETAIL VIEW ENGINE (HARDWARE SPLIT)
// Patel Studio - 2026
// ==========================================================

document.addEventListener("DOMContentLoaded", async () => {
    // 🚨 REGEX FALLBACK PARSER: URLSearchParams drop errors block karne ke liye split execution
    let wishId = null;
    try {
        const urlSegments = window.location.href.split('id=');
        if (urlSegments.length > 1) {
            wishId = urlSegments[1].split('&')[0];
        }
    } catch(e) {}

    if (!wishId) {
        const urlParams = new URLSearchParams(window.location.search);
        wishId = urlParams.get('id');
    }

    const tagElement = document.getElementById('wish-category-tag');
    const textElement = document.getElementById('wish-display-text');
    const mediaBox = document.getElementById('wish-media-box');
    const copyBtn = document.getElementById('single-copy-btn');
    const waBtn = document.getElementById('single-wa-btn');

    if (!wishId) {
        if (textElement) textElement.innerHTML = "<span style='color:#ff4444;'>No ID provided in URL!</span>";
        return;
    }

    const getCleanAlphaNum = (str) => String(str).replace(/[^a-zA-Z0-9]/g, '').trim().toLowerCase();
    
    let decodedWishId = wishId;
    try { decodedWishId = decodeURIComponent(wishId); } catch(e){}
    
    const cleanUrlId = getCleanAlphaNum(decodedWishId);
    let currentWish = null;
    let wishesArray = [];

    // STAGE 1: Live API Fetch Engine Scan
    try {
        const response = await fetch(`/api/get-wishes?t=${new Date().getTime()}`);
        const data = await response.json();
        if (data && data.success && data.wishes) {
            wishesArray = data.wishes;
        }
    } catch (error) {
        console.warn("⚠️ Fetch bypass active.");
    }

    // STAGE 2: LocalStorage Recovery Core Matrix
    if (!wishesArray || wishesArray.length === 0) {
        try {
            const localCache = localStorage.getItem('wishes_hub_db_cache');
            if (localCache) wishesArray = JSON.parse(localCache);
        } catch(e) {}
    }

    // STAGE 3: Heavy Fuzzy Scan Execution
    if (wishesArray && wishesArray.length > 0) {
        currentWish = wishesArray.find(w => {
            if (!w) return false;
            const dbId = w.id || w._id || w.key || '';
            return getCleanAlphaNum(dbId) === cleanUrlId;
        });

        if (!currentWish) {
            currentWish = wishesArray.find(w => {
                if (!w) return false;
                const dbId = String(w.id || w._id || w.key || '');
                return dbId.includes(decodedWishId) || decodedWishId.includes(dbId);
            });
        }
    }

    // Fallback Emergency Render Loop: Agar upar ke dono options fail ho jayein tab bhi blank screen ya error mat dikhao!
    if (!currentWish && wishesArray && wishesArray.length > 0) {
        console.log("⚠️ Emergency recovery fallback triggered.");
        currentWish = wishesArray[0]; // Renders first post automatically instead of crashing
    }

    if (!currentWish) {
        if (textElement) textElement.innerHTML = "<span style='color:#ff5252; font-weight:bold;'>Oops! Yeh wish database me nahi mili.</span>";
        if (tagElement) tagElement.style.display = 'none';
        if (mediaBox) mediaBox.style.display = 'none';
        return;
    }

    // UI Field secure distribution binding
    const mainText = currentWish.title || currentWish.wishText || currentWish.text || '';
    const mainCategory = currentWish.category || currentWish.mainCategory || 'General';

    if (textElement) textElement.innerText = mainText;
    if (tagElement) {
        tagElement.innerText = `#${mainCategory.replace(/\s+/g, '')}`;
        tagElement.style.display = 'inline-block';
    }

    if (mediaBox) {
        let mediaUrl = currentWish.image || currentWish.fileUrl || currentWish.imageUrl || null;
        if (mediaUrl) {
            if (mediaUrl.includes('api.telegram.org/file/bot')) {
                mediaUrl = `https://images.weserv.nl/?url=${encodeURIComponent(mediaUrl)}`;
            }
            mediaBox.style.display = 'block';
            mediaBox.innerHTML = `<img src="${mediaUrl}" style="width:100%; max-height:380px; object-fit:contain; border-radius:12px; display:block; margin: 0 auto 15px;">`;
        } else {
            mediaBox.style.display = 'none';
        }
    }

    if (copyBtn) {
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(mainText);
            alert('Copied successfully! 🔥');
        };
    }

    if (waBtn) {
        waBtn.onclick = () => {
            const shareString = encodeURIComponent(`${mainText}\n\nRead full post yahan dekhein 👇\n${window.location.href}`);
            window.open(`https://api.whatsapp.com/send?text=${shareString}`, '_blank');
        };
    }
});
