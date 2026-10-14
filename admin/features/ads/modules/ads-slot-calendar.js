/**
 * Wishes Hub - Slot Availability & Booking Calendar
 * File: admin/features/ads/modules/ads-slot-calendar.js
 * Description: Tracks zone capacity, booked dates, and available ad slots
 *              for advance festival bookings.
 */

export class AdsSlotCalendar {
  constructor(coreInstance) {
    this.core = coreInstance;
    this.maxSlotsPerZone = 5;
  }

  /**
   * Get Slot Availability Count for Specified Zone and Date
   * @param {string} zoneId 
   * @returns {Object} Slot status
   */
  getZoneAvailability(zoneId) {
    const activeInZone = this.core.state.activeAds.filter(
      ad => ad.zoneId === zoneId && ad.status === 'ACTIVE'
    ).length;

    const remaining = Math.max(0, this.maxSlotsPerZone - activeInZone);

    return {
      zoneId,
      totalSlots: this.maxSlotsPerZone,
      bookedSlots: activeInZone,
      availableSlots: remaining,
      isFullyBooked: remaining === 0
    };
  }
}
