/**
 * Create Wish Feature - Audio Wish Sub-Module
 * Path: admin/features/create-wish/modules/audio-wish-module.js
 */

import { createWishAudioInstance } from '../create-wish-audio.js';

export class AudioWishModule {
  render(container) {
    container.innerHTML = `
      <div class="form-group">
        <label>Voice Recording / Audio</label>
        <div class="audio-controls">
          <button type="button" id="btn-start-record" class="btn-secondary">🎙️ Record</button>
          <button type="button" id="btn-stop-record" class="btn-danger" disabled>⏹️ Stop</button>
        </div>
      </div>
      <div class="form-group">
        <label>Audio Overlay Message</label>
        <textarea id="input-content" rows="2" placeholder="Optional text with audio..."></textarea>
      </div>
    `;
  }

  bindEvents(onUpdate) {
    const btnStart = document.getElementById('btn-start-record');
    const btnStop = document.getElementById('btn-stop-record');

    btnStart?.addEventListener('click', async () => {
      const res = await createWishAudioInstance.startRecording();
      if (res.success) {
        btnStart.disabled = true;
        btnStop.disabled = false;
      }
    });

    btnStop?.addEventListener('click', async () => {
      const res = await createWishAudioInstance.stopRecording();
      if (res.success) {
        btnStart.disabled = false;
        btnStop.disabled = true;
        onUpdate({ Audio_CDN_URL: res.audioUrl });
      }
    });

    document.getElementById('input-content')?.addEventListener('input', (e) => {
      onUpdate({ Content: e.target.value });
    });
  }
}
