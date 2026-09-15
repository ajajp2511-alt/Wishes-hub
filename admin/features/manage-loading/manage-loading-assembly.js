/**
 * manage-loading-assembly.js
 * Combines all sub-modules and registers views for the router registry
 */
import { loader } from './manage-loading-core.js';
import { LoadingConfig } from './manage-loading-cnfig.js';
import { LoadingHistory } from './modules/manage-loading-history.js';
import { LoadingHealth } from './modules/manage-loading-health.js';
import { LoadingSpinner } from './modules/manage-loading-spinner.js';
import { LoadingOverlay } from './modules/manage-loading-overlay.js';
import { LoadingSafety } from './modules/manage-loading-safety.js';
import { LoadingAnalytics } from './modules/manage-loading-analytics.js';
import { LoadingTemplate } from './modules/manage-loading-template.js';

export function init(rootId, featureName) {
  // Initialize health cleanup & session tracking
  LoadingHealth.initMemoryCleanup();
  LoadingHistory.initSessionTracking();

  const root = document.getElementById(rootId);
  if (root) {
    root.innerHTML = `
      <div style="padding: 24px; font-family: inherit;">
        <h2 style="margin-bottom: 8px; text-transform: capitalize; color: #0f172a;">${featureName.replace(/-/g, ' ')}</h2>
        <p style="color: #64748b; margin-bottom: 20px;">Manage Loading sub-module is successfully loaded and integrated.</p>
        <div style="padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
          <p style="font-size: 14px; color: #334155; margin-bottom: 6px;"><strong>Active Feature Key:</strong> ${featureName}</p>
          <p style="font-size: 14px; color: #334155;"><strong>Default Timeout:</strong> ${LoadingConfig.defaultTimeout}ms</p>
        </div>
      </div>
    `;
  }
  return true;
}

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
