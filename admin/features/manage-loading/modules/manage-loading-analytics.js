/**
 * modules/manage-loading-analytics.js
 * Performance metrics logging
 */
export const LoadingAnalytics = {
  logMetric(durationMs) {
    if (localStorage.getItem('wishes_debug_mode') === 'true') {
      console.log(`[Loading Analytics] Active duration: ${durationMs.toFixed(2)}ms`);
    }
  }
};
