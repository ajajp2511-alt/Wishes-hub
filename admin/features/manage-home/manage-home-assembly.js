/**
 * manage-home-assembly.js
 * Main entry point combining all sub-modules
 */
import { homeDashboard } from './manage-home-core.js';
import { HomeStats } from './modules/manage-home-stats.js';
import { HomeActivity } from './modules/manage-home-activity.js';
import { HomeActions } from './modules/manage-home-actions.js';
import { HomeAnnouncements } from './modules/manage-home-announcements.js';

export function assembleHomeModule(containerSelector) {
  HomeAnnouncements.render();
  HomeStats.fetchAndRender();
  HomeActivity.initStream();
  HomeActions.bindShortcuts();
  
  homeDashboard.init(containerSelector);
  return homeDashboard;
}
