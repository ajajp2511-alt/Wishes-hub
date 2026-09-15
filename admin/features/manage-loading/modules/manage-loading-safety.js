/**
 * modules/manage-loading-safety.js
 * Timeout fallback & network status handler
 */
export const LoadingSafety = {
  timerId: null,

  startTimer(callback, timeoutMs) {
    this.clearTimer();
    this.timerId = setTimeout(() => {
      console.warn('Wishes Hub Loader: Safety timeout triggered. Force dismissing loader.');
      callback();
    }, timeoutMs);

    window.addEventListener('offline', this.handleOffline);
  },

  clearTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    window.removeEventListener('offline', this.handleOffline);
  },

  handleOffline() {
    const msgEl = document.getElementById('wishes-loading-message');
    if (msgEl) {
      msgEl.innerText = 'Reconnecting to network...';
    }
  }
};
