/**
 * Live Countdown & Expiry Redirection Guard
 * Path: admin/features/automation/modules/automation-countdown.js
 * Description: Renders real-time countdown timers for upcoming festivals and automatically
 *              handles expired event redirections to upcoming trending festival pages.
 */

import { automationCore } from '../automation-core.js';

export class AutomationCountdownEngine {
  constructor() {
    this.core = automationCore;
  }

  /**
   * Calculate exact time remaining until target festival date
   */
  calculateTimeRemaining(targetIsoDate) {
    const total = Date.parse(targetIsoDate) - Date.parse(new Date());
    
    if (total <= 0) {
      return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
      isExpired: false
    };
  }

  /**
   * Evaluate page redirection guard if festival is expired
   */
  evaluateExpiryRedirection(festivalEventDate, fallbackFestivalId = 'fest_newyear') {
    const timeRemaining = this.calculateTimeRemaining(festivalEventDate);

    if (timeRemaining.isExpired) {
      const redirectUrl = `https://wishes-hub.com/greeting?fest=${fallbackFestivalId}&redirectedFromExpired=true`;
      
      this.core.log('COUNTDOWN', `Event expired on ${festivalEventDate}. Redirecting to ${fallbackFestivalId}`, 'WARN');
      
      return {
        shouldRedirect: true,
        redirectUrl,
        reason: 'EVENT_EXPIRED'
      };
    }

    return {
      shouldRedirect: false,
      timeRemaining
    };
  }
}

export const automationCountdown = new AutomationCountdownEngine();
