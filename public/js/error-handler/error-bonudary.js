/**
 * Global Error Isolation System
 */

// 1. Script/JS Crashes ko isolate aur stop karein
window.addEventListener('error', function (event) {
  console.warn('[Error Shield] Crash Intercepted:', event.message, 'in', event.filename);
  // Browser crash/blank screen behvior ko roko
  return true; 
});

// 2. API / Fetch Promise Rejections ko handle karein
window.addEventListener('unhandledrejection', function (event) {
  console.warn('[Error Shield] API/Promise Error:', event.reason);
});

/**
 * Safe Function Runner
 */
window.safeRun = function (featureName, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[Error Shield] Suppressed crash in "${featureName}":`, err);
  }
};
