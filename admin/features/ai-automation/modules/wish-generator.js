import { AI_CONFIG } from '../ai-config.js';

export class WishGeneratorModule {
  static render(container, core) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">✨ AI Wish Generator</h4>
        <p style="font-size:13px; color:#586069;">Tone, relationship, aur context ke hisaab se automated festive wishes generate karein.</p>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:15px;">
          <div>
            <label style="font-size:12px; font-weight:bold;">Select Tone:</label>
            <select id="wish-tone" style="width:100%; padding:8px; margin-top:4px; border-radius:4px; border:1px solid #ccc;">
              ${AI_CONFIG.supportedTones.map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:12px; font-weight:bold;">Recipient / Relation:</label>
            <input type="text" id="wish-relation" placeholder="e.g. Best Friend, Boss, Brother" style="width:100%; padding:7px; margin-top:4px; border-radius:4px; border:1px solid #ccc;" />
          </div>
        </div>

        <button id="btn-generate-wish" style="margin-top:15px; width:100%; padding:10px; background:#0088cc; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
          🚀 Generate AI Wish
        </button>

        <div id="wish-output" style="margin-top:15px; padding:12px; background:#fafbfc; border:1px dashed #d1d5da; border-radius:6px; font-size:13px; display:none;">
          <!-- Generated Result Here -->
        </div>
      </div>
    `;

    container.querySelector('#btn-generate-wish')?.addEventListener('click', async () => {
      const output = container.querySelector('#wish-output');
      output.style.display = 'block';
      output.innerHTML = '⚡ Generating wish via Vercel AI Engine...';
      
      const tone = container.querySelector('#wish-tone').value;
      const relation = container.querySelector('#wish-relation').value || 'Friend';

      const res = await core.generateWish({ tone, relation });
      output.innerHTML = res.text || `✨ <i>"Aapko aur aapke parivar ko iss pawan parv ki hardik shubhkamnayein! (${tone} tone for ${relation})"</i>`;
    });
  }
}
