/**
 * Global & Regional Festival Calendar Engine
 * Path: admin/features/automation/modules/automation-calendar.js
 * Description: Manages multi-tier festival schedules, country whitelist filtering, 
 *              and automatic trigger date calculations.
 */

import { AUTOMATION_CONFIG } from '../automation-config.js';
import { automationCore } from '../automation-core.js';

export class AutomationCalendarEngine {
  constructor() {
    this.config = AUTOMATION_CONFIG;
    this.core = automationCore;
  }

  /**
   * Get all active festivals filtered by country whitelist and tier
   */
  getEligibleFestivals(countryCode = 'IN') {
    // Check if country is allowed
    if (!this.config.allowedCountries.includes(countryCode)) {
      this.core.log('CALENDAR', `Country code ${countryCode} is not in active whitelist.`, 'WARN');
      return [];
    }

    return this.config.festivalMasterDatabase.filter(fest => {
      return fest.countryCodes.includes(countryCode);
    });
  }

  /**
   * Check upcoming festivals within lead trigger days
   */
  getUpcomingEvents(targetDaysAhead = 10, countryCode = 'IN') {
    const today = new Date();
    const currentYear = today.getFullYear();
    const eligibleFestivals = this.getEligibleFestivals(countryCode);

    const upcoming = [];

    eligibleFestivals.forEach(fest => {
      const [month, day] = fest.defaultDate.split('-').map(Number);
      let eventDate = new Date(currentYear, month - 1, day);

      // If festival already passed this year, check next year
      if (eventDate < today) {
        const diffDays = Math.ceil((today - eventDate) / (1000 * 60 * 60 * 24));
        if (diffDays > 3) { // Passed more than 3 days ago
          eventDate = new Date(currentYear + 1, month - 1, day);
        }
      }

      const timeDiff = eventDate - today;
      const daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (daysUntil >= 0 && daysUntil <= fest.leadDaysTrigger) {
        upcoming.push({
          ...fest,
          calculatedEventDate: eventDate.toISOString().split('T')[0],
          daysUntil,
          isTriggerReady: true
        });
      }
    });

    this.core.log('CALENDAR', `Found ${upcoming.length} upcoming events for country ${countryCode}`, 'INFO');
    return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
  }

  /**
   * Add Custom Regional Festival to Master List
   */
  addCustomFestival(festivalData) {
    const newFestival = {
      id: 'fest_custom_' + Date.now(),
      tier: festivalData.tier || 3,
      countryCodes: festivalData.countryCodes || ['IN'],
      category: festivalData.category || 'Regional',
      leadDaysTrigger: festivalData.leadDaysTrigger || 7,
      supportedLangs: festivalData.supportedLangs || ['hi', 'en'],
      has3DSupport: festivalData.has3DSupport ?? true,
      ...festivalData
    };

    this.config.festivalMasterDatabase.push(newFestival);
    this.core.log('CALENDAR', `Added custom festival: ${newFestival.name}`, 'SUCCESS');
    return newFestival;
  }
}

export const automationCalendar = new AutomationCalendarEngine();
