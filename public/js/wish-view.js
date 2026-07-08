// Wishes Hub: Single Wish Viewer Engine + Deep Debugger
// Patel Studio - 2026

document.addEventListener("DOMContentLoaded", async () => {
    console.log("=== WISH VIEWER DEBUG ENGINE START ===");

    // 1. URL se ?id=... nikalna
    const urlParams = new URLSearchParams(window.location.search);
    const wishId = urlParams.get('id');
    console.log("📌 URL se mili Wish ID:", wishId);

    const tagElement = document.getElementById('wish-category-tag');
    const textElement = document.getElementById('wish-display-text');
    const mediaBox = document.getElementById('wish-media-box');
    const copyBtn = document.getElementById('single-copy-btn');
    const waBtn = document.getElementById('single-wa-btn');

    if (!wishId) {
        console.error("❌ Error: URL me koi ID nahi mili!");
        if (textElement) textElement.innerHTML = "<span style='color:#ff4444;'>Error: No Wish ID specified in URL!</span>";
        if (tagElement) tagElement.style.display = 'none';
        return;
    }

    try {
        // 2. Server se wishes ka data mangwana (Cache busting enabled)
        const endpoint = `/api/get-wishes?t=${new Date().getTime()}`;
        console.log("📡 Fetching data from:", endpoint);
        const response = await fetch(endpoint);
        const data = await response.json();

        console.log("📦 Raw Database Response:", data);

        if (!data.success || !data.wishes) {
            throw new Error("Backend data fetch status failed or wishes empty.");
        }

        // 3. Array ke andar search match debug check
        console.log("🔍 Database me total items:", data.wishes.length);
        if (data.wishes.length > 0) {
            console.log("💡 Sample item 1 from DB:", data.wishes[0]);
        }

        // Safe lowercase check aur alag-alag key permutations (.id ya ._id ya .key)
        const currentWish = data.wishes.find(w => {
            if (!w) return false;
            const dbId = String(w.id || w._id || w.key || '').trim();
            const targetId = String(wishId).trim();
            return dbId === targetId;
        });

        if (!currentWish) {
            console.error(`❌ Data Match Failed! Database me ID "${wishId}" nahi mili.`);
            if (textElement) textElement.innerHTML = "<span style='color:#ff4444;'>Oops! Yeh wish database me nahi mili.</span>";
            if (tagElement) tagElement.style.display = 'none';
            return;
        }

        console.log("🎯 Match Found Success! Data object:", currentWish);

        // 4. Data ko HTML page par render (set) karna
        const displayTitle = currentWish.title || currentWish.wishText || currentWish.text || 'No Text Content';
        const displayCategory = currentWish.category || currentWish.mainCategory || 'General';
        
        if (tagElement) {
            tagElement.innerText = `#${displayCategory}`;
            tagElement.style.display = 'inline-block';
        }
        if (textElement) textElement.innerText = displayTitle;

        // 📸 Media Logic (Images / Animations / Telegram Links)
        if (mediaBox) {
            let finalMediaUrl = currentWish.image || currentWish.imageUrl || null;
            
            if (!finalMediaUrl && currentWish.telegramFileId) {
                finalMediaUrl = `/api/get-media?fileId=${currentWish.telegramFileId}&type=${currentWish.fileType || 'photo'}`;
            }

            if (finalMediaUrl) {
                mediaBox.style.display = 'block';
                const isVideoGif = currentWish.fileType === 'video' || currentWish.fileType === 'animation' || finalMediaUrl.includes('.mp4') || finalMediaUrl.includes('.gif');

                if (isVideoGif) {
                    mediaBox.innerHTML = `<video src="${finalMediaUrl}" loop muted autoplay playsinline style="width:100%; display:block; object-fit:cover; border-radius:12px;"></video>`;
                } else {
                    let proxyUrl = finalMediaUrl;
                    if (finalMediaUrl.includes('api.telegram.org/file/bot')) {
                        const rawPath = finalMediaUrl.split('bot')[1];
                        proxyUrl = `https://imtqy.com/bot${rawPath}`;
                    }
                    mediaBox.innerHTML = `<img src="${proxyUrl}" alt="Media Content" style="width:100%; max-height:400px; object-fit:contain; border-radius:12px; display:block;">`;
                }
            } else {
                mediaBox.style.display = 'none';
            }
        }

        // 5. COPY Button working
        if (copyBtn) {
            copyBtn.onclick = () => {
                const textToCopy = textElement ? textElement.innerText : (currentWish.title || '');
                navigator.clipboard.writeText(textToCopy);
                alert('Wish text successfully copy ho gaya! 🔥');
            };
        }

        // 6. WHATSAPP SHARE Button working
        if (waBtn) {
            waBtn.onclick = () => {
                const textToShare = textElement ? textElement.innerText : (currentWish.title || '');
                const shareText = encodeURIComponent(`${textToShare}\n\nFull Post Yahan Dekhein 👇\n${window.location.href}`);
                window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
            };
        }

    } catch (error) {
        console.error("🚨 View Render Crash:", error);
        if (textElement) textElement.innerHTML = `<span style='color:#ff4444;'>Engine Error: ${error.message}</span>`;
    }
});
