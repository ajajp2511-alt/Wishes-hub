/**
 * 3D Audio Visualizer & Beat-Reactive Lighting Module
 * Path: wishes-hub/admin/features/3d/modules/3d-audio-visualizer.js
 */

import * as THREE from 'three';
import { coreEngine } from '../3d-core.js';

export class AudioVisualizer {
  constructor() {
    this.moduleName = '3d-audio-visualizer';
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.reactiveLights = [];
    this.isAnalyzing = false;

    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Bind Web Audio API Analyser to HTML Audio Element
  attachAudioSource(audioElement) {
    if (!audioElement) {
      console.warn('[Audio Visualizer] Audio element is required.');
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 64;

    const source = this.audioContext.createMediaElementSource(audioElement);
    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    this.isAnalyzing = true;
    this.startBeatLoop();
  }

  // Attach dynamic lights to react to frequency audio spectrum
  registerReactiveLight(pointLight, maxIntensity = 3) {
    if (pointLight && pointLight.isLight) {
      this.reactiveLights.push({ light: pointLight, baseIntensity: pointLight.intensity, maxIntensity });
    }
  }

  startBeatLoop() {
    if (!this.isAnalyzing || !this.analyser) return;

    requestAnimationFrame(() => this.startBeatLoop());

    this.analyser.getByteFrequencyData(this.dataArray);

    // Calculate bass frequency intensity
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += this.dataArray[i];
    }
    const averageBass = sum / 8; // 0 - 255
    const normalizedBass = averageBass / 255;

    // Pulse reactive lights with beat
    this.reactiveLights.forEach(({ light, baseIntensity, maxIntensity }) => {
      light.intensity = baseIntensity + normalizedBass * (maxIntensity - baseIntensity);
    });

    coreEngine.emit('audiovisualizer:beat', { intensity: normalizedBass });
  }
}

export default AudioVisualizer;
