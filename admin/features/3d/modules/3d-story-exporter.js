/**
 * 3D Story Exporter & 360-Degree Video/GIF Engine Module
 * Path: wishes-hub/admin/features/3d/modules/3d-story-exporter.js
 */

import { coreEngine } from '../3d-core.js';

export class StoryExporter {
  constructor() {
    this.moduleName = '3d-story-exporter';
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;

    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Record 360-degree rotation animation clip for Instagram/WhatsApp Stories
  async record360Video(durationMs = 5000, fps = 30) {
    const renderer = coreEngine.state.activeRenderer;
    const scene = coreEngine.state.activeScene;
    const camera = coreEngine.state.activeCamera;

    if (!renderer || !scene || !camera) {
      throw new Error('[Story Exporter] Active Three.js context not found.');
    }

    const canvas = renderer.domElement;
    const stream = canvas.captureStream(fps);

    this.recordedChunks = [];
    
    // Fallback options for cross-browser WebM / MP4 video encoding
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    this.mediaRecorder = new MediaRecorder(stream, { mimeType });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        
        this.isRecording = false;
        coreEngine.emit('exporter:complete', { videoUrl, blob });
        resolve({ videoUrl, blob });
      };

      this.isRecording = true;
      coreEngine.emit('exporter:start', { durationMs });
      this.mediaRecorder.start();

      // Automatic 360 Camera Orbit Animation
      const startTime = Date.now();
      const initialCamRadius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2) || 3;

      const animateOrbit = () => {
        if (!this.isRecording) return;

        const elapsed = Date.now() - startTime;
        const progress = elapsed / durationMs;
        const angle = progress * Math.PI * 2;

        camera.position.x = Math.sin(angle) * initialCamRadius;
        camera.position.z = Math.cos(angle) * initialCamRadius;
        camera.lookAt(0, 0, 0);

        if (elapsed < durationMs) {
          requestAnimationFrame(animateOrbit);
        } else {
          this.mediaRecorder.stop();
        }
      };

      animateOrbit();
    });
  }
}

export default StoryExporter;
