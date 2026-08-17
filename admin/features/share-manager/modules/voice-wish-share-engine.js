export class VoiceWishShareEngineModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🎙️ Voice Wish & Audio Greeting Engine</h4>
        <p style="font-size:13px; color:#586069;">Attach custom recorded audio notes to outgoing greeting links.</p>
      </div>
    `;
  }
}
