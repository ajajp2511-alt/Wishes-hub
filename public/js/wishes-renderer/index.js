/**
 * Wishes Renderer Module
 */
export async function initWishesRenderer() {
  const targetElement = document.getElementById('wishes-list');

  if (!targetElement) {
    console.error("❌ Target #wishes-list container nahi mila!");
    return;
  }

  // Initial Loading state
  targetElement.innerHTML = `
    <div style="text-align:center; padding: 30px; color:#3182ce; font-weight:600;">
      ✨ Loading Wishes...
    </div>
  `;

  try {
    const response = await fetch('/api/get-wishes');
    
    if (!response.ok) {
      throw new Error(`API Error Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.wishes || data.wishes.length === 0) {
      targetElement.innerHTML = `
        <div style="text-align:center; padding: 30px; color:#a0aec0;">
          Abhi koi wishes available nahi hain.
        </div>`;
      return;
    }

    targetElement.innerHTML = ""; // Clear loader

    data.wishes.forEach(wish => {
      const card = document.createElement('div');
      card.className = 'wish-card'; 
      card.setAttribute('data-category', wish.category || 'General');
      
      card.style.cssText = `
        background: #ffffff;
        border-radius: 16px;
        padding: 16px;
        margin-top: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        border: 1px solid #edf2f7;
        cursor: pointer;
      `;

      // Media Logic (Images / GIFs / Videos)
      let mediaHtml = '';
      let finalMediaUrl = wish.imageUrl || null;

      if (!finalMediaUrl && wish.telegramFileId) {
        finalMediaUrl = `/api/get-media?fileId=${wish.telegramFileId}&type=${wish.fileType || 'photo'}`;
      }

      if (finalMediaUrl) {
        const isVideo = wish.fileType === 'video' || wish.fileType === 'animation' || finalMediaUrl.includes('.mp4') || finalMediaUrl.includes('.gif');
        
        if (isVideo) {
          mediaHtml = `
            <div style="width:100%; border-radius:10px; overflow:hidden; background:#000; margin-bottom: 12px;">
              <video src="${finalMediaUrl}" loop muted autoplay playsinline style="width:100%; max-height:220px; display:block; object-fit:cover;"></video>
            </div>`;
        } else {
          let proxyUrl = finalMediaUrl;
          if (finalMediaUrl.includes('api.telegram.org/file/bot')) {
            const rawTokenPath = finalMediaUrl.split('bot')[1];
            proxyUrl = `https://imtqy.com/bot${rawTokenPath}`;
          }

          mediaHtml = `
            <div style="width:100%; border-radius:10px; overflow:hidden; background:#f7fafc; text-align:center; margin-bottom: 12px;">
              <img src="${proxyUrl}" alt="Wish Media" loading="lazy" onerror="this.parentElement.style.display='none';" style="max-width:100%; max-height:220px; object-fit:contain; border-radius:10px;">
            </div>`;
        }
      }

      const safeCopyText = (wish.title || '').replace(/`/g, '\\`').replace(/\$/g, '\\$');

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
          <span style="background:#ebf8ff; color:#3182ce; font-size:11px; padding:4px 10px; border-radius:20px; font-weight:700; text-transform:uppercase;">
            #${wish.category || 'General'}
          </span>
        </div>
        
        ${mediaHtml}

        <p class="wish-text" style="color:#2d3748; font-size:0.95rem; line-height:1.6; margin:8px 0; white-space: pre-wrap; font-weight: 500;">
          ${wish.title || 'No Text'}
        </p>
        
        <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px solid #f7fafc;">
          <span style="color:#3182ce; font-size:13px; font-weight:600;">View Details →</span>
          <button class="copy-btn" 
                  style="background:#3182ce; color:#ffffff; border:none; padding:7px 16px; border-radius:8px; cursor:pointer; font-weight:600; font-size:12px;"
                  onclick="event.stopPropagation(); navigator.clipboard.writeText(\`${safeCopyText}\`); alert('Wish copy ho gayi!');">
            📋 Copy
          </button>
        </div>
      `;

      card.addEventListener('click', () => {
        window.location.href = `page/wish.html?id=${wish._id}`;
      });

      targetElement.appendChild(card);
    });

  } catch (error) {
    console.error("Render Error:", error);
    targetElement.innerHTML = `
      <div style="color:#e53e3e; padding:15px; text-align:center; background:#fff5f5; border-radius:12px; margin-top:10px; font-size: 0.9rem;">
        Wishes load nahi ho paayein (${error.message})
      </div>`;
  }

  return { status: "initialized", module: "wishes-renderer" };
                            }
