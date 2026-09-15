/**
 * modules/manage-loading-health.js
 * Memory leak prevention and auto-cleanup
 */
export const LoadingHealth = {
  initMemoryCleanup() {
    window.addEventListener('beforeunload', () => {
      const overlay = document.getElementById('wishes-loading-overlay');
      if (overlay) overlay.remove();
    });
  }
};
