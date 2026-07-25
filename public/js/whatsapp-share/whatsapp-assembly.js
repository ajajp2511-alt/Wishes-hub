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
    const shareBtns = document.querySelectorAll(WHATSAPP_CONFIG.SELECTORS.SHARE_BTN);

    shareBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const nameInput = document.querySelector(WHATSAPP_CONFIG.SELECTORS.NAME_INPUT);
        const customName = nameInput ? nameInput.value : '';
        
        const wishMessage = e.currentTarget.dataset.message || WHATSAPP_CONFIG.DEFAULT_TEXT;
        const wishUrl = e.currentTarget.dataset.url || window.location.href;

        const shareUrl = this.core.generateShareUrl(customName, wishMessage, wishUrl);
        window.open(shareUrl, '_blank');
      });
    });
  }
}
