import { MUSIC_CONFIG } from './music-config.js';
import { MusicCore } from './music-core.js';

export class MusicAssembly {
  constructor() {
    this.core = new MusicCore();
  }

  init(defaultTrackUrl) {
    if (defaultTrackUrl) {
      this.core.loadTrack(defaultTrackUrl);
    }
    this.bindEvents();
  }

  bindEvents() {
    const playBtn = document.querySelector(MUSIC_CONFIG.SELECTORS.PLAY_PAUSE_BTN);
    const volumeSlider = document.querySelector(MUSIC_CONFIG.SELECTORS.VOLUME_SLIDER);
    const progressBar = document.querySelector(MUSIC_CONFIG.SELECTORS.PROGRESS_BAR);

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        const isPlaying = this.core.togglePlay();
        playBtn.classList.toggle('playing', isPlaying);
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        this.core.setVolume(e.target.value / 100);
      });
    }

    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = (clickX / rect.width) * 100;
        this.core.seekTo(percentage);
      });

      this.core.audio.addEventListener('timeupdate', () => {
        const progress = this.core.getProgress();
        const progressFill = progressBar.querySelector('.progress-fill');
        if (progressFill) {
          progressFill.style.width = `${progress}%`;
        }
      });
    }
  }
      }
