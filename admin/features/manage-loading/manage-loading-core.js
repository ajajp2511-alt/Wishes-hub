/**
 * manage-loading-core.js
 * Core show/hide logic, queue management, and Custom Events dispatcher
 */
import { LoadingConfig } from './manage-loading-config.js';
import { LoadingOverlay } from './modules/manage-loading-overlay.js';
import { LoadingSpinner } from './modules/manage-loading-spinner.js';
import { LoadingSafety } from './modules/manage-loading-safety.js';
import { LoadingAnalytics } from './modules/manage-loading-analytics.js';

class LoadingManage {
  constructor() {
    this.queueCount = 0;
    this.startTime = null;
  }

  show(options = {}) {
    this.queueCount++;
    if (this.queueCount === 1) {
      this.startTime = performance.now();
      const animationType = options.animation || LoadingConfig.defaultAnimation;
      const message = options.message || LoadingConfig.messages.en.default;

      LoadingOverlay.render(message);
      LoadingSpinner.render(animationType);
      LoadingSafety.startTimer(() => this.forceHide(), options.timeout || LoadingConfig.defaultTimeout);
      
      window.dispatchEvent(new CustomEvent('wishes-loader:shown', { detail: { animationType } }));
    }
  }

  hide() {
    if (this.queueCount > 0) {
      this.queueCount--;
    }
    if (this.queueCount === 0) {
      this.forceHide();
    }
  }

  forceHide() {
    this.queueCount = 0;
    LoadingSafety.clearTimer();
    LoadingOverlay.remove();
    LoadingSpinner.remove();

    if (this.startTime) {
      const duration = performance.now() - this.startTime;
      LoadingAnalytics.logMetric(duration);
      this.startTime = null;
    }

    window.dispatchEvent(new CustomEvent('wishes-loader:hidden'));
  }
}

export const loader = new LoadingManage();

window.addEventListener('wishes-loader:show', (e) => loader.show(e.detail));
window.addEventListener('wishes-loader:hide', () => loader.hide());
