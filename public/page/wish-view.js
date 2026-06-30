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
        textElement.innerHTML = "<span style='color:#ff4444;'>Error: No Wish ID specified in URL!</span>";
        tagElement.style.display = 'none';
        return;
    }

    try {
        // 2. Server se wishes ka data mangwana
        const response = await fetch('/api/get-wishes');
        const data = await response.json();

        if (!data.success || !data.wishes) {
            throw new Error("Backend data fail ho gaya.");
        }

        // 3. Apni wali specific wish dhoondhna array me se
        const currentWish = data.wishes.find(w => w._id === wishId);

        if (!currentWish) {
            textElement.innerHTML = "<span style='color:#ff4444;'>Oops! Yeh wish database me nahi mili.</span>";
            tagElement.style.display = 'none';
            return;
        }

        // 4. Data ko HTML page par render (set) karna
        tagElement.innerText = `#${currentWish.category || 'General'}`;
        textElement.innerText = currentWish.title || 'No Text Content';

        // 📸 Media Logic (Images / Animations / Telegram Links)
        let finalMediaUrl = currentWish.imageUrl || null;
        if (!finalMediaUrl && currentWish.telegramFileId) {
            finalMediaUrl = `/api/get-media?fileId=${currentWish.telegramFileId}&type=${currentWish.fileType || 'photo'}`;
        }

        if (finalMediaUrl) {
            mediaBox.style.display = 'block';
            const isVideoGif = currentWish.fileType === 'video' || currentWish.fileType === 'animation' || finalMediaUrl.includes('.mp4') || finalMediaUrl.includes('.gif');

            if (isVideoGif) {
                mediaBox.innerHTML = `<video src="${finalMediaUrl}" loop muted autoplay playsinline style="width:100%; display:block; object-fit:cover;"></video>`;
            } else {
                // Telegram file proxy bypass config
                let proxyUrl = finalMediaUrl;
                if(finalMediaUrl.includes('api.telegram.org/file/bot')) {
                    const rawPath = finalMediaUrl.split('bot')[1];
                    proxyUrl = `https://imtqy.com/bot${rawPath}`;
                }
                mediaBox.innerHTML = `<img src="${proxyUrl}" alt="Media Content" style="width:100%; max-height:400px; object-fit:contain; display:block;">`;
            }
        }

        // 5. COPY Button working
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(currentWish.title);
            alert('Wish text successfully copy ho gaya! 🔥');
        });

        // 6. WHATSAPP SHARE Button working
        waBtn.addEventListener('click', () => {
            const shareText = encodeURIComponent(`${currentWish.title}\n\nFull Post Yahan Dekhein 👇\n${window.location.href}`);
            window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
        });

    } catch (error) {
        console.error("View Render Crash:", error);
        textElement.innerHTML = `<span style='color:#ff4444;'>Engine Error: ${error.message}</span>`;
    }
});
