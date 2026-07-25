import { WHATSAPP_CONFIG } from './whatsapp-config.js';

export class WhatsAppCore {
  constructor(baseUrl = WHATSAPP_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  formatMessage(customName, wishMessage, wishUrl) {
    let finalMsg = '';
    
    if (customName) {
      finalMsg += `✨ *${customName}* has sent you a special wish!\n\n`;
    }
    
    finalMsg += `${wishMessage}\n\n👉 Open here: ${wishUrl}`;
    return encodeURIComponent(finalMsg);
  }

  generateShareUrl(customName, wishMessage, wishUrl, phone = '') {
    const encodedText = this.formatMessage(customName, wishMessage, wishUrl);
    let url = `${this.baseUrl}?text=${encodedText}`;
    
    if (phone) {
      url += `&phone=${phone}`;
    }
    
    return url;
  }

  shareViaNativeApi(title, text, url) {
    if (navigator.share) {
      return navigator.share({ title, text, url });
    }
    return Promise.reject(new Error('Native share not supported'));
  }
                                      }
