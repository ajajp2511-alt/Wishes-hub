// ==========================================================
// 🌐 WISHES HUB USER PANEL - DETAIL VIEW ENGINE (DECODE MATCH)
// Patel Studio - 2026
// ==========================================================

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let wishId = urlParams.get('id');

    const tagElement = document.getElementById('wish-category-tag');
    const textElement = document.getElementById('wish-display-text');
    const mediaBox = document.getElementById('wish-media-box');
    const copyBtn = document.getElementById('single-copy-btn');
    const waBtn = document.getElementById('single-wa-btn');

    if (!wishId) {
        if (textElement) textElement.innerHTML = "<span style='color:#ff4444;'>No ID provided in URL!</span>";
        return;
    }

    // 🚨 FIX 1: Clean and decode URL strings thoroughly
    wishId = decodeURIComponent(wishId).trim().toLowerCase();

    try {
        // Absolute path routing ensuring Vercel structure match
        const response = await fetch(`/api/get-wishes?t=${new Date().getTime()}`);
        const data = await response.json();

        if (!data.success || !data.wishes) throw new Error("Data fetching failed");

        // 🚨 FIX 2: Strict but Case-Insensitive fallback search loop
        const currentWish = data.wishes.find(w => {
            if (!w) return false;
            const dbId = w.id || w._id || w.key || '';
            
            // Convert both side IDs to lowercase to bypass exact string mismatches in browser URLs
            return String(dbId).trim().toLowerCase() === wishId;
        });

        if (!currentWish) {
            if (textElement) textElement.innerHTML = "<span style='color:#ff5252; font-weight:bold;'>Oops! Yeh wish database me nahi mili.</span>";
            if (tagElement) tagElement.style.display = 'none';
            if (mediaBox) mediaBox.style.display = 'none';
            return;
        }

        // Render fields securely
        const mainText = currentWish.title || currentWish.wishText || currentWish.text || '';
        const mainCategory = currentWish.category || currentWish.mainCategory || 'General';

        if (textElement) textElement.innerText = mainText;
        if (tagElement) {
            tagElement.innerText = `#${mainCategory.replace(/\s+/g, '')}`;
            tagElement.style.display = 'inline-block';
        }

        // Image loading logic with stable proxy
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

        // Action Buttons Setup
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

    } catch (error) {
        console.error("🚨 Render Crash:", error);
        if (textElement) textElement.innerHTML = "<span style='color:#ff5252;'>Database connectivity issue or render crash!</span>";
    }
});
