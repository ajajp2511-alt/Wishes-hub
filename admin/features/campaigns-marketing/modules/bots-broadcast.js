export class BotsBroadcastModule {
  static render(container, core) {
    const rules = core.getBotRules();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">WhatsApp & Telegram Bot Automation</h4>
        <p style="font-size:13px; color:#586069;">Auto-responders, keyword triggers, and broadcast queues.</p>
        
        <div style="margin-top:15px; display:flex; flex-direction:column; gap:10px;">
          ${rules.map(r => `
            <div style="padding:12px; border:1px solid #e1e4e8; border-radius:6px; background:#fafbfc;">
              <strong>Trigger Keyword:</strong> <code style="background:#e1e4e8; padding:2px 6px; border-radius:4px;">${r.keyword}</code>
              <p style="margin:6px 0 0; font-size:13px; color:#24292e;"><strong>Reply:</strong> ${r.replyText}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
