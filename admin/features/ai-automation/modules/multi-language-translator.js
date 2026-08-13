import { AI_CONFIG } from '../ai-config.js';

export class MultiLanguageTranslatorModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🌐 Neural Multi-Language Translator</h4>
        <p style="font-size:13px; color:#586069;">Instant translation & Hinglish-to-Regional transliteration.</p>
        
        <div style="display:flex; gap:10px; margin-top:15px;">
          ${AI_CONFIG.supportedLanguages.map(l => `<span style="padding:4px 8px; background:#f0f3f6; border-radius:4px; font-size:12px;">${l.name}</span>`).join('')}
        </div>
      </div>
    `;
  }
}
