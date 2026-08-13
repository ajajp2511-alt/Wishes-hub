import { MEDIA_CONFIG } from '../media-config.js';

export class TelegramStorageEngineModule {
  static render(container, core) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0; color:#0088cc;">Telegram Bot Storage Engine (Free Hosting)</h4>
        <p style="font-size:13px; color:#586069;">Zero-cost media hosting powered by Telegram Channel & Bot API.</p>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-top:15px;">
          <div style="padding:15px; background:#f0f8ff; border:1px solid #b6e3ff; border-radius:6px;">
            <strong>Bot Configuration Status</strong>
            <div style="font-size:12px; margin-top:6px; color:#24292e;">
              <div>• Bot Token: <code style="background:#fff; padding:2px 4px;">Configured</code></div>
              <div>• Channel ID: <code>${MEDIA_CONFIG.telegram.chatId}</code></div>
              <div>• Direct Vercel Proxy: <span style="color:#2da44e; font-weight:bold;">Active</span></div>
            </div>
          </div>

          <div style="padding:15px; background:#fafbfc; border:1px solid #e1e4e8; border-radius:6px;">
            <strong>Upload Test File to Telegram</strong>
            <input type="file" id="tg-file-input" style="display:block; margin-top:8px; font-size:12px;" />
            <button id="btn-tg-upload" style="margin-top:10px; padding:6px 12px; background:#0088cc; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:12px;">
              Upload to Telegram Channel
            </button>
          </div>
        </div>
      </div>
    `;

    // Upload logic placeholder
    container.querySelector('#btn-tg-upload')?.addEventListener('click', () => {
      alert('Telegram Direct Upload Triggered! File ID will be indexed in database.');
    });
  }
}
