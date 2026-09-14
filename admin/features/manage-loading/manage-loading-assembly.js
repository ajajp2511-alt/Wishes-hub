/**
 * manage-loading-assembly.js
 * Combines all sub-modules and registers views for the router registry
 */
import { loader } from './manage-loading-core.js';
import { LoadingConfig } from './manage-loading-config.js';
import { LoadingHistory } from './modules/manage-loading-history.js';
import { LoadingHealth } from './modules/manage-loading-health.js';
import { LoadingSpinner } from './modules/manage-loading-spinner.js';
import { LoadingOverlay } from './modules/manage-loading-overlay.js';
import { LoadingSafety } from './modules/manage-loading-safety.js';
import { LoadingAnalytics } from './modules/manage-loading-analytics.js';
import { LoadingTemplate } from './modules/manage-loading-template.js';

export function assembleLoadingModule() {
  // Initialize health cleanup & session tracking
  LoadingHealth.initMemoryCleanup();
  LoadingHistory.initSessionTracking();

  // Return the loader instance along with view handlers for the router registry
  return {
    loader,
    config: LoadingConfig,
    views: {
      'loading-spinner': LoadingSpinner,
      'loading-overlay': LoadingOverlay,
      'loading-safety': LoadingSafety,
      'loading-analytics': LoadingAnalytics,
      'loading-history': LoadingHistory,
      'loading-template': LoadingTemplate
    }
  };
}
