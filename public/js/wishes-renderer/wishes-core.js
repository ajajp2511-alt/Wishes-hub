/* Wishes Renderer Core Orchestrator */
import { WishesConfig } from './wishes-config.js';
import { fetchWishesData } from './wishes-api.js';
import { generateMediaHtml } from './wishes-media.js';
import { initSearchLogic } from './wishes-search.js';
import { renderFavoriteButton } from './wishes-favorite.js';
import { syncFavoritesUI } from '../favorites/favorites-assembly.js';

export class WishesCore {
    constructor() {}

    async startApp() {
        console.log("Wishes Hub: System Booting...");

        const targetElement = document.getElementById(WishesConfig.defaultContainerId) || 
                              document.getElementById(WishesConfig.fallbackContainerId) ||
                              document.getElementById('wishes-list') ||
                              document.querySelector('.wishes-container');

        if (targetElement) {
            targetElement.innerHTML = "<p style='color:#00adb5; padding:20px; text-align:center;'>Initializing Patel Studio Engine...</p>";
        }

        try {
            if (typeof window.initStorage === 'function') await window.initStorage();
            if (typeof window.loadCategories === 'function') window.loadCategories();

            if (targetElement) {
                await this.renderWishes(targetElement);
            }

            initSearchLogic();
            console.log("Wishes Hub: All Systems Online");

        } catch (error) {
            console.error("Boot Error:", error);
            if (targetElement) {
                targetElement.innerHTML = `<div style="color:#ff4444; padding:20px; text-align:center;">Launch Error: ${error.message}</div>`;
            }
        }
    }

    async renderWishes(gridElement) {
        try {
            const wishes = await fetchWishesData();

            if (!wishes || wishes.length === 0) {
                gridElement.innerHTML = "<p style='color:#666; padding:20px; text-align:center;'>Abhi tak koi wishes available nahi hain.</p>";
                return;
            }

            gridElement.innerHTML = "";

            wishes.forEach(wish => {
                const wishId = wish._id || wish.id;
                const card = document.createElement('div');
                card.className = 'wish-card';
                card.setAttribute('data-category', wish.category || 'General');
                card.setAttribute('data-text', (wish.title || '').toLowerCase());
                card.style.cursor = "pointer";

                const mediaHtml = generateMediaHtml(wish);
                const safeCopyText = (wish.title || '').replace(/`/g, '\\`').replace(/\$/g, '\\$');

                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                        <span style="background:#00f2ff; color:#000; font-size:12px; padding:3px 10px; border-radius:20px; font-weight:bold;">
                            #${wish.category || 'General'}
                        </span>

                        <!-- 💥 FAVORITE HEART BUTTON COMPONENT -->
                        <div onclick="event.stopPropagation();">
                            ${renderFavoriteButton(wishId)}
                        </div>
                    </div>

                    ${mediaHtml}

                    <p class="wish-text" style="color:#111111; font-size:15px; line-height:1.6; margin:10px 0; white-space: pre-wrap; word-break: break-word; font-weight:500;">
                        ${wish.title || 'No Text'}
                    </p>

                    <div style="text-align:right; margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
                        <span style="color:#00adb5; font-size:13px; font-weight:bold;">View Details →</span>
                        <button class="copy-btn" 
                                style="background:#0a192f; color:#00f2ff; border:1px solid #00f2ff; padding:6px 14px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:13px;"
                                onclick="event.stopPropagation(); navigator.clipboard.writeText(\`${safeCopyText}\`); alert('Wish text copied!');">
                            Copy
                        </button>
                    </div>
                `;

                card.addEventListener('click', () => {
                    window.location.href = `page/wish.html?id=${wishId}`;
                });

                gridElement.appendChild(card);
            });

            // 💥 SYNC FAVORITES UI ON CARDS AFTER RENDER
            await syncFavoritesUI();

        } catch (error) {
            console.error("Render Error:", error);
            gridElement.innerHTML = `<p style='color:#ff4444; padding:20px; text-align:center;'>Wishes load nahi ho payi: ${error.message}</p>`;
        }
    }
                                  }
