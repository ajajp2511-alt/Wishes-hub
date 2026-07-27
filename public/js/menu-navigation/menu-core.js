/* Menu Navigation Core Logic (Side Drawer) */
import { MenuConfig } from './menu-config.js';

export class MenuCore {
    constructor() {
        this.container = document.getElementById(MenuConfig.containerId);
    }

    renderMenu() {
        if (!this.container) {
            console.warn(`Menu container #${MenuConfig.containerId} not found in DOM.`);
            return;
        }

        let navHtml = `
            <div class="side-drawer-menu" style="display:flex; flex-direction:column; gap:8px; padding:15px; background:#0a192f; border-right:1px solid #00f2ff; min-height:100vh;">
                <div style="font-size:12px; color:#00f2ff; font-weight:bold; letter-spacing:1px; margin-bottom:5px; text-transform:uppercase;">
                    Navigation
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
    }
}
