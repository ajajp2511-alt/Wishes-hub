/**
 * modules/manage-loading-overlay.js
 * Backdrop, blur, and z-index layer stack management
 */
import { LoadingConfig } from '../manage-loading-config.js';

export const LoadingOverlay = {
  render(messageText) {
    if (document.getElementById('wishes-loading-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'wishes-loading-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: ${LoadingConfig.themes.dark.bg};
      backdrop-filter: blur(4px);
      z-index: ${LoadingConfig.zIndex};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    `;

    const message = document.createElement('div');
    message.id = 'wishes-loading-message';
    message.style.cssText = `
      margin-top: 16px;
      color: #ffffff;
      font-family: inherit;
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.5px;
    `;
    message.innerText = messageText;

    overlay.appendChild(message);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => (overlay.style.opacity = '1'));
  },

  remove() {
    const overlay = document.getElementById('wishes-loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
  }
};
