/**
 * Wishes Hub - Time-Slot & Festival Event Trigger Engine
 * File: admin/features/ads/modules/ads-event-trigger.js
 * Description: Triggers category-specific ads based on time of day 
 *              and active festival calendars.
 */

export class AdsEventTrigger {
  /**
   * Check if an ad category matches current time-slot trigger
   * @param {string} category 
   * @returns {boolean} Should display
   */
  isCategoryActiveForTimeSlot(category) {
    const currentHour = new Date().getHours();

    if (category === 'Food & Restaurant') {
      // Show food ads during Lunch (12 PM - 3 PM) and Dinner (7 PM - 10 PM)
      return (currentHour >= 12 && currentHour <= 15) || (currentHour >= 19 && currentHour <= 22);
    }

    return true; // Default always active
  }
}
