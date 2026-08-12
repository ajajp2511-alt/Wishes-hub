/**
 * Create Wish Feature - Audio & BGM Engine
 * Path: admin/features/create-wish/create-wish-audio.js
 */

export class CreateWishAudio {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.recordedAudioBlob = null;
  }

  /**
   * Start Voiceover Recording
   */
  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      return { success: true, message: 'Recording started...' };
    } catch (error) {
      console.error('[CreateWishAudio] Recording Error:', error);
      return { success: false, message: 'Microphone permission denied or unavailable.' };
    }
  }

  /**
   * Stop Voiceover Recording
   */
  stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve({ success: false, message: 'Recorder not initialized.' });
        return;
      }

      this.mediaRecorder.onstop = () => {
        this.recordedAudioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(this.recordedAudioBlob);
        resolve({
          success: true,
          audioBlob: this.recordedAudioBlob,
          audioUrl
        });
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Attach BGM Track
   */
  attachBGM(bgmTrackUrl, volume = 0.5) {
    return {
      bgmUrl: bgmTrackUrl,
      volume: Math.min(Math.max(volume, 0), 1)
    };
  }
}

export const createWishAudioInstance = new CreateWishAudio();
