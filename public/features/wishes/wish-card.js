/**
 * Wish Card Template Generator (Upgraded with Dual Media Pipeline)
 * Path: public/features/wishes/wish-card.js
 */

export function createWishCard(wish) {
    // wish object me processed fields (id, text, category, likes, mediaUrl, fileType) aa rahi hain
    
    let mediaHtml = '';

    // 📸 Media Rendering Engine (Image/GIF/Video Check)
    if (wish.mediaUrl) {
        const isGifVideo = wish.fileType === 'video' || 
                           wish.fileType === 'animation' || 
                           wish.mediaUrl.includes('.mp4') || 
                           wish.mediaUrl.includes('.gif');
        
        if (isGifVideo) {
            mediaHtml = `
                <div class="card-media-wrapper" style="width:100%; border-radius:8px; overflow:hidden; background:#000;">
                    <video src="${wish.mediaUrl}" loop muted autoplay playsinline style="width:100%; max-height:250px; display:block; object-fit:cover;"></video>
                </div>`;
        } else {
            mediaHtml = `
                <div class="card-media-wrapper" style="width:100%; border-radius:8px; overflow:hidden; background:#1e1e1e; text-align:center;">
                    <img src="${wish.mediaUrl}" 
                         alt="Wish Media" 
                         loading="lazy" 
                         onerror="this.parentElement.style.display='none';"
                         style="max-width:100%; max-height:250px; object-fit:contain; display:inline-block; border-radius:8px;">
                </div>`;
        }
    }

    // Safe inline copy text logic safely handling backticks and dollar signs
    const safeCopyText = wish.text.replace(/`/g, '\\`').replace(/\$/g, '\\$');

    return `
        <div class="wish-card" data-id="${wish.id}" data-category="${wish.category}" style="background:#121212; border:1px solid #333; border-radius:12px; padding:15px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 10px; min-width: 260px;">
            
            <div class="wish-card-header" style="display:flex; justify-content:space-between; align-items:center;">
                <span style="background:#00f2ff; color:#000; font-size:12px; padding:3px 8px; border-radius:20px; font-weight:bold;">
                    #${wish.category}
                </span>
                <button class="like-btn" onclick="handleLike('${wish.id}')" style="background:transparent; border:none; color:#fff; cursor:pointer; display:flex; align-items:center; gap:5px;">
                    <span class="heart-icon">🤍</span> 
                    <span class="like-count" style="font-size:14px;">${wish.likes}</span>
                </button>
            </div>
            
            ${mediaHtml}

            <p class="wish-text" style="color:#fff; font-size:16px; line-height:1.5; margin:5px 0; white-space: pre-wrap; flex-grow: 1;">
                ${wish.text}
            </p>
            
            <div class="wish-card-footer" style="display:flex; gap:10px; margin-top:auto;">
                <button class="copy-btn" 
                        style="flex:1; background:#222; color:#00f2ff; border:1px solid #00f2ff; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:13px;"
                        onclick="navigator.clipboard.writeText(\`${safeCopyText}\`); alert('Wish text copied!');">
                    📋 Copy
                </button>
                <button class="whatsapp-btn" 
                        style="flex:1; background:#25D366; color:#fff; border:none; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:13px;"
                        onclick="shareOnWhatsApp('${wish.id}')">
                    💬 Share
                </button>
            </div>
        </div>
    `;
}
