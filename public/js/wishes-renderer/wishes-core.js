/* Wishes Renderer Core Logic (Patel Studio Engine) */
import { WishesConfig } from './wishes-config.js';

export class WishesCore {
    constructor() {
        // Constructor ko clean rakha hai, startApp assembly init() se run hoga
    }

    async startApp() {
        console.log("Wishes Hub: System Booting...");
        
        const oldGrid = document.getElementById(WishesConfig.fallbackContainerId);
        const newSection = document.getElementById(WishesConfig.defaultContainerId);
        const targetElement = oldGrid || newSection;
        
        if (targetElement && oldGrid) {
            targetElement.innerHTML = "<p style='color:#00f2ff; padding:20px;'>Initializing Patel Studio Engine...</p>";
        }

        try {
            if (typeof window.initStorage === 'function') {
                await window.initStorage();
                console.log("Storage: Loaded");
            }

            if (typeof window.loadCategories === 'function') {
                window.loadCategories(); 
                console.log("Categories Navigation: Loaded");
            }
            
            if (targetElement) {
                await this.fetchWishesFromServer(targetElement);
            }
            
            this.setupSearchLogic();
            console.log("Wishes Hub: All Systems Online");

        } catch (error) {
            console.error("Boot Error:", error);
            if (targetElement) {
                targetElement.innerHTML = `
                    <div style="color:#ff4444; padding:20px; border:1px solid #ff4444; border-radius:10px; background:#121212;">
                        <h3>Launch Error</h3>
                        <p>${error.message}</p>
                    </div>`;
            }
        }
    }

    async fetchWishesFromServer(gridElement) {
        try {
            const response = await fetch(WishesConfig.apiEndpoint);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Server error occurred.");
            }

            if (!data.wishes || data.wishes.length === 0) {
                gridElement.innerHTML = "<p style='color:#fff; padding:20px;'>Abhi tak koi wishes available nahi hain.</p>";
                return;
            }

            gridElement.innerHTML = ""; 

            data.wishes.forEach(wish => {
                const card = document.createElement('div');
                card.className = 'wish-card'; 
                card.setAttribute('data-category', wish.category || 'General');
                card.setAttribute('data-text', (wish.title || '').toLowerCase());
                card.style.cursor = "pointer";

                // Media Logic
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
                        if(finalMediaUrl.includes('api.telegram.org/file/bot')) {
                             const rawTokenPath = finalMediaUrl.split('bot')[1];
                             proxyCleanUrl = `${WishesConfig.mediaProxyBase}${rawTokenPath}`;
                        }

                        mediaHtml = `
                            <div style="width:100%; border-radius:8px; overflow:hidden; background:#1e1e1e; text-align:center; margin-bottom: 10px;">
                                <img src="${proxyCleanUrl}" alt="Wish Media" loading="lazy" onerror="this.parentElement.style.display='none';" style="max-width:100%; max-height:250px; object-fit:contain; display:inline-block; border-radius:8px;">
                            </div>`;
                    }
                }

                const safeCopyText = (wish.title || '').replace(/`/g, '\\`').replace(/\$/g, '\\$');

                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                        <span style="background:#00f2ff; color:#000; font-size:12px; padding:3px 8px; border-radius:20px; font-weight:bold;">
                            #${wish.category || 'General'}
                        </span>
                    </div>
                    
                    ${mediaHtml}

                    <p class="wish-text" style="color:#fff; font-size:16px; line-height:1.5; margin:5px 0; white-space: pre-wrap;">
                        ${wish.title || 'No Text'}
                    </p>
                    
                    <div style="text-align:right; margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
                        <span style="color:#00f2ff; font-size:12px; font-weight:bold;">View Details →</span>
                        <button class="copy-btn" 
                                style="background:#222; color:#00f2ff; border:1px solid #00f2ff; padding:6px 14px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:13px;"
                                onclick="event.stopPropagation(); navigator.clipboard.writeText(\`${safeCopyText}\`); alert('Wish text copied!');">
                            Copy
                        </button>
                    </div>
                `;

                card.addEventListener('click', () => {
                    window.location.href = `page/wish.html?id=${wish._id}`;
                });

                gridElement.appendChild(card);
            });

        } catch (error) {
            console.error("Fetch Error:", error);
            gridElement.innerHTML = `<p style='color:#ff4444; padding:20px;'>Wishes load nahi ho payi: ${error.message}</p>`;
        }
    }

    setupSearchLogic() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.wish-card');

            cards.forEach(card => {
                const cardBody = card.querySelector('.wish-text');
                const cardText = cardBody ? cardBody.innerText.toLowerCase() : '';
                const cardCategory = card.getAttribute('data-category') || '';
                
                const matchesCategory = (typeof window.activeCategory === 'undefined' || window.activeCategory === "All" || cardCategory === window.activeCategory);
                const matchesSearch = cardText.includes(query);

                if (matchesCategory && matchesSearch) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }
                                }
