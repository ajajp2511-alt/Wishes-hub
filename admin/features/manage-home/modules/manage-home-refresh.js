/**
 * modules/manage-home-refresh.js
 * Background auto-polling and sync
 */
import { HomeConfig } from '../manage-home-config.js';
import { HomeStats } from './manage-home-stats.js';

export const HomeRefresh = {
  timer: null,

  startPolling() {
    this.stopPolling();
    this.timer = setInterval(() => {
      HomeStats.fetchAndRender();
    }, HomeConfig.refreshInterval);
  },

  stopPolling() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
