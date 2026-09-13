/**
 * manage-loading-assembly.js
 * Combines all sub-modules and initializes the loader subsystem
 */
import { loader } from './manage-loading-core.js';
import { LoadingHistory } from './modules/manage-loading-history.js';
import { LoadingHealth } from './modules/manage-loading-health.js';

export function assembleLoadingModule() {
  LoadingHealth.initMemoryCleanup();
  LoadingHistory.initSessionTracking();
  return loader;
}
