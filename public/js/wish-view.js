// Wishes Hub: Single Wish Viewer Engine
// Patel Studio - 2026

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Wish Viewer Active...");

    // 1. URL se ?id=... nikalna
    const urlParams = new URLSearchParams(window.location.search);
    const wishId = urlParams.get('id');

    const tagElement = document.getElementById('wish-category-tag');
    const textElement = document.getElementById('wish-display-text');
    const mediaBox = document.getElementById('wish-media-box');
    const copyBtn = document.getElementById('single-copy-btn');
    const waBtn = document.getElementById('single-wa-btn');

    if (!wishId) {
        if (textElement) textElement.innerHTML = "<span style='color:#ff4444;'>Error: No Wish ID specified in URL!</span>";
        if (tagElement) tagElement.style.display = 'none';
        return;
    }

    try {
        // 2. Server se wishes ka data mangwana
        const endpoint = `/api/get-wishes?t=${new Date().getTime()}`;
        const response = await fetch(endpoint);
        const data = await response.json();

        if (!data.success || !data.wishes) {
            throw new Error("Backend data fail ho gaya.");
        }

        // 3. FIX: 'w._id' ki jagah 'w.id' se find kiya jo Realtime DB me save ho raha hai
        const currentWish = data.wishes.find(w => w.id === wishId || w._id === wishId);

        if (!currentWish) {
            if (textElement) textElement.innerHTML = "<span style='color:#ff4444;'>Oops! Yeh wish database me nahi mili.</span>";
            if (tagElement) tagElement.style.display = 'none';
            return;
        }

        // 4. Data ko HTML page par render (set) karna
        const displayTitle = currentWish.title || currentWish.wishText || 'No Text Content';
        
        if (tagElement) tagElement.innerText = `#${currentWish.category || currentWish.mainCategory || 'General'}`;
        if (textElement) textElement.innerText = displayTitle;

        // 📸 Media Logic (Images / Animations / Telegram Links)
        if (mediaBox) {
            // Naye aur purane dono variables ko safely match kiya
            let finalMediaUrl = currentWish.image || currentWish.imageUrl || null;
            
            // Agar seedha photo url nahi hai but telegram file ID hai to hum proxy API hit karenge
            if (!finalMediaUrl && currentWish.telegramFileId) {
                finalMediaUrl = `/api/get-media?fileId=${currentWish.telegramFileId}&type=${currentWish.fileType || 'photo'}`;
            }

            if (finalMediaUrl) {
                mediaBox.style.display = 'block';
                const isVideoGif = currentWish.fileType === 'video' || currentWish.fileType === 'animation' || finalMediaUrl.includes('.mp4') || finalMediaUrl.includes('.gif');

                if (isVideoGif) {
                    mediaBox.innerHTML = `<video src="${finalMediaUrl}" loop muted autoplay playsinline style="width:100%; display:block; object-fit:cover; border-radius:12px;"></video>`;
                } else {
                    // Telegram file proxy bypass logic
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

        // 5. COPY Button working safely
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const textToCopy = currentWish.title || currentWish.wishText || '';
                navigator.clipboard.writeText(textToCopy);
                alert('Wish text successfully copy ho gaya! 🔥');
            });
        }

        // 6. WHATSAPP SHARE Button working safely
        if (waBtn) {
            waBtn.addEventListener('click', () => {
                const textToShare = currentWish.title || currentWish.wishText || '';
                const shareText = encodeURIComponent(`${textToShare}\n\nFull Post Yahan Dekhein 👇\n${window.location.href}`);
                window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
            });
        }

    } catch (error) {
        console.error("View Render Crash:", error);
        if (textElement) textElement.innerHTML = `<span style='color:#ff4444;'>Engine Error: ${error.message}</span>`;
    }
});
