export class AudioTracksModule {
  static render(container, core) {
    const audios = core.getMediaItems('audio');
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Audio Tracks & Festive Music</h4>
        <p style="font-size:13px; color:#586069;">Background music clips, audio trimmer, and BPM detector.</p>
        <div style="margin-top:15px;">
          ${audios.map(a => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border:1px solid #e1e4e8; border-radius:6px; margin-bottom:8px;">
              <div>
                <strong>🎵 ${a.name}</strong>
                <small style="display:block; color:#586069;">Size: ${a.size} • Telegram Hosted</small>
              </div>
              <button style="padding:4px 10px; font-size:12px; background:#238636; color:#fff; border:none; border-radius:4px; cursor:pointer;">▶ Play Preview</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
