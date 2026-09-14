/**
 * modules/manage-loading-history.js
 * Session state logging & queue management helper
 */
export const LoadingHistory = {
  initSessionTracking() {
    window.__wishes_loader_history = window.__wishes_loader_history || [];
  }
};
