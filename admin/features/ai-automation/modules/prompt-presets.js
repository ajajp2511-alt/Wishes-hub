export class PromptPresetsModule {
  static render(container, core) {
    const prompts = core.getPrompts();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⚙️ System Prompt Presets</h4>
        <p style="font-size:13px; color:#586069;">Fine-tuned system prompts, personas, and creativity temperature controls.</p>

        <div style="margin-top:15px;">
          ${prompts.map(p => `
            <div style="padding:10px; border:1px solid #e1e4e8; border-radius:6px; margin-bottom:8px; background:#fafbfc;">
              <strong>${p.title}</strong>
              <small style="display:block; color:#586069;">Category: ${p.category} • Temp: ${p.temperature}</small>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
