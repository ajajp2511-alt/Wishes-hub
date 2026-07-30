/* Menu Navigation Core Logic (Side Drawer) */
import { MenuConfig } from './menu-config.js';

export class MenuCore {
    constructor() {
        this.container = document.getElementById(MenuConfig.containerId);
        this.injectDedicatedCSS(); // Dedicated menu-style.css load
    }

    // Dynamic CSS Injector
    injectDedicatedCSS() {
        if (!document.getElementById('menu-style-link')) {
            const link = document.createElement('link');
            link.id = 'menu-style-link';
            link.rel = 'stylesheet';
            link.href = './js/menu-navigation/menu-style.css';
            document.head.appendChild(link);
        }
    }

    renderMenu() {
        if (!this.container) {
            console.warn(`Menu container #${MenuConfig.containerId} not found in DOM.`);
            return;
        }

        let navHtml = `
            <div class="side-drawer-menu" style="display:flex; flex-direction:column; gap:8px; padding:20px 15px; background:#0a192f; border-left:1px solid #00f2ff; min-height:100vh;">
                
                <!-- Drawer Header with Close Button -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="font-size:12px; color:#00f2ff; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">
                        Navigation
                    </div>
                    <button id="close-drawer-btn" style="background:none; border:none; color:#a0aec0; font-size:20px; cursor:pointer;">✕</button>
                </div>
        `;

        MenuConfig.drawerItems.forEach(item => {
            navHtml += `
                <a href="${item.link}" id="${item.id}" class="drawer-item-btn" 
                   style="display:flex; align-items:center; gap:12px; padding:10px 14px; background:#121212; color:#ffffff; border-radius:8px; text-decoration:none; font-size:14px; font-weight:500; border:1px solid #1e293b; transition:all 0.2s ease;">
                   <span style="font-size:18px;">${item.icon}</span>
                   <span>${item.label}</span>
                </a>
            `;
        });

        navHtml += `</div>`;
        this.container.innerHTML = navHtml;

        this.bindInternalEvents();
    }

    bindInternalEvents() {
        // Global Click Listener for Menu Interactivity
        document.addEventListener('click', async (e) => {
            
            // 1. Close Button Trigger
            if (e.target.closest('#close-drawer-btn')) {
                if (this.container) {
                    this.container.classList.remove('active', 'open');
                }
                return;
            }

            // 2. Favorite Item Click Trigger (ID ya Class/Text se detect karega)
            const favTarget = e.target.closest('#nav-favorite, [href="#favorite"]');
            
            if (favTarget) {
                e.preventDefault();
                console.log("❤️ Favorite menu clicked!");

                // Side drawer close karo
                if (this.container) {
                    this.container.classList.remove('active', 'open');
                }

                // Global function check karke Favorites view trigger karo
                if (typeof window.renderOnlyFavorites === 'function') {
                    await window.renderOnlyFavorites();
                } else {
                    // Dynamic import fallback agar global window object me na ho
                    try {
                        const module = await import('../favorites/favorites-assembly.js');
                        if (module && module.renderOnlyFavorites) {
                            await module.renderOnlyFavorites();
                        }
                    } catch (err) {
                        console.error("Failed to load favorites view module:", err);
                    }
                }
            }
        });
    }
}
