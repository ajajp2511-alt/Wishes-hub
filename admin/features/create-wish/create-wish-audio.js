/**
 * Create Wish Feature - Audio & BGM Engine
 * Path: admin/features/create-wish/create-wish-audio.js
 */

export class CreateWishAudio {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.recordedAudioBlob = null;
    this.mediaStream = null;
  }

  async startRecording() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
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

  stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve({ success: false, message: 'Recorder not initialized.' });
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
        this.recordedAudioBlob = new Blob(this.audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(this.recordedAudioBlob);

        // Release microphone hardware resources
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach((track) => track.stop());
          this.mediaStream = null;
        }

        resolve({
          success: true,
          audioBlob: this.recordedAudioBlob,
          audioUrl,
          mimeType
        });
      };

      this.mediaRecorder.stop();
    });
  }

  attachBGM(bgmTrackUrl, volume = 0.5) {
    return {
      bgmUrl: bgmTrackUrl,
      volume: Math.min(Math.max(volume, 0), 1)
    };
  }
}

export const createWishAudioInstance = new CreateWishAudio();
