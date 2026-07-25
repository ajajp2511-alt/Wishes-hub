import { WHATSAPP_CONFIG } from './whatsapp-config.js';
import { WhatsAppCore } from './whatsapp-core.js';

export class WhatsAppAssembly {
  constructor() {
    this.core = new WhatsAppCore();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Event delegation for dynamically rendered share buttons
    document.addEventListener('click', (e) => {
      const shareBtn = e.target.closest(WHATSAPP_CONFIG.SELECTORS.SHARE_BTN);
      if (!shareBtn) return;

      e.preventDefault();

      const nameInput = document.querySelector(WHATSAPP_CONFIG.SELECTORS.NAME_INPUT);
      const customName = nameInput ? nameInput.value.trim() : '';

      const wishMessage = shareBtn.getAttribute('data-wish-message') || WHATSAPP_CONFIG.DEFAULT_TEXT;
      const wishUrl = window.location.href;

      const shareUrl = this.core.generateShareUrl(customName, wishMessage, wishUrl);

      // Open WhatsApp link in new tab
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    });
  }
}
