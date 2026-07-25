/**
 * Wishes Renderer Module
 * Integrates directly with Patel Studio backend (/api/get-wishes & /api/get-media)
 */

export async function initWishesRenderer() {
  const targetElement = document.getElementById('wishes-list') || document.getElementById('wishes-grid') || document.getElementById('latest-wishes-section');

  if (!targetElement) {
    console.warn("⚠️ Wishes Renderer: Target element not found in DOM.");
    return;
  }

  targetElement.innerHTML = "<p style='color:#3182ce; padding:20px; text-align:center;'>Initializing Patel Studio Engine...</p>";

  try {
    const response = await fetch('/api/get-wishes');
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Server error occurred.");
    }

    if (!data.wishes || data.wishes.length === 0) {
      targetElement.innerHTML = "<p style='color:#718096; padding:20px; text-align:center;'>Abhi tak koi wishes available nahi hain.</p>";
      return;
    }

    targetElement.innerHTML = ""; // Clear loader

    data.wishes.forEach(wish => {
      const card = document.createElement('div');
      card.className = 'wish-card'; 
      card.setAttribute('data-category', wish.category || 'General');
      card.setAttribute('data-text', (wish.title || '').toLowerCase());
      card.style.cursor = "pointer";

      // 📸 MEDIA LOGIC (Images, GIFs, Videos & Telegram Proxies)
      let mediaHtml = '';
      let finalMediaUrl = wish.imageUrl || null;

      if (!finalMediaUrl && wish.telegramFileId) {
        finalMediaUrl = `/api/get-media?fileId=${wish.telegramFileId}&type=${wish.fileType || 'photo'}`;
      }

      if (finalMediaUrl) {
        const isGifVideo = wish.fileType === 'video' || wish.fileType === 'animation' || finalMediaUrl.includes('.mp4') || finalMediaUrl.includes('.gif');
        
        if (isGifVideo) {
          mediaHtml = `
            <div style="width:100%; border-radius:8px; overflow:hidden; background:#000; margin-bottom: 10px;">
              <video src="${finalMediaUrl}" loop muted autoplay playsinline style="width:100%; max-height:250px; display:block; object-fit:cover;"></video>
            </div>`;
        } else {
          let proxyCleanUrl = finalMediaUrl;
          if (finalMediaUrl.includes('api.telegram.org/file/bot')) {
            const rawTokenPath = finalMediaUrl.split('bot')[1];
            proxyCleanUrl = `https://imtqy.com/bot${rawTokenPath}`;
          }

          mediaHtml = `
            <div style="width:100%; border-radius:8px; overflow:hidden; background:#f7fafc; text-align:center; margin-bottom: 10px;">
              <img src="${proxyCleanUrl}" alt="Wish Media" loading="lazy" onerror="this.parentElement.style.display='none';" style="max-width:100%; max-height:250px; object-fit:contain; display:inline-block; border-radius:8px;">
            </div>`;
        }
      }

      const safeCopyText = (wish.title || '').replace(/`/g, '\\`').replace(/\$/g, '\\$');

      // Card DOM
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
          <span style="background:#3182ce; color:#fff; font-size:12px; padding:3px 10px; border-radius:20px; font-weight:bold;">
            #${wish.category || 'General'}
          </span>
        </div>
        
        ${mediaHtml}

        <p class="wish-text" style="color:#2d3748; font-size:16px; line-height:1.5; margin:8px 0; white-space: pre-wrap;">
          ${wish.title || 'No Text'}
        </p>
        
        <div style="text-align:right; margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
          <span style="color:#3182ce; font-size:12px; font-weight:bold;">View Details →</span>
          <button class="copy-btn" 
                  style="background:#edf2f7; color:#2b6cb0; border:1px solid #cbd5e0; padding:6px 14px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:13px;"
                  onclick="event.stopPropagation(); navigator.clipboard.writeText(\`${safeCopyText}\`); alert('Wish text copied!');">
            Copy
          </button>
        </div>
      `;

      // Single wish page navigation on click
      card.addEventListener('click', () => {
        window.location.href = `page/wish.html?id=${wish._id}`;
      });

      targetElement.appendChild(card);
    });

    console.log("🎨 Wishes Renderer: Loaded dynamic wishes successfully!");

  } catch (error) {
    console.error("Fetch Error:", error);
    targetElement.innerHTML = `
      <div style="color:#e53e3e; padding:20px; border:1px solid #fed7d7; border-radius:10px; background:#fff5f5; text-align:center;">
        <h3>Launch Error</h3>
        <p>${error.message}</p>
      </div>`;
  }

  return { status: "initialized", module: "wishes-renderer" };
          }
