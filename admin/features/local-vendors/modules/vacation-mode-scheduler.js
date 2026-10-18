/**
 * Wishes Hub - Vacation & Temporary Closure Mode Module
 * File: modules/vacation-mode-scheduler.js
 */

import { coreEngine } from '../local-vendors-core.js';

export class VacationModeSchedulerModule {
  constructor() {
    this.moduleName = 'vacation-mode-scheduler';
  }

  /**
   * Enable or schedule vacation/temporary closure mode for a vendor or housewife
   * @param {String} vendorId 
   * @param {Object} vacationConfig - { active: Boolean, resumeTimestamp: String (ISO) }
   * @returns {Object} Result
   */
  setVacationMode(vendorId, vacationConfig) {
    const vendor = coreEngine.state.activeVendors.get(vendorId);
    if (!vendor) {
      throw new Error(`Vendor not found with ID: ${vendorId}`);
    }

    const isActive = Boolean(vacationConfig.active);
    
    vendor.vacationMode = {
      active: isActive,
      resumeTimestamp: vacationConfig.resumeTimestamp || null,
      updatedAt: new Date().toISOString()
    };

    // If vacation is active, automatically set store status to CLOSED
    if (isActive) {
      vendor.status = 'CLOSED_ON_VACATION';
    } else {
      vendor.status = 'OPEN';
    }

    coreEngine.setVendorState(vendorId, vendor);

    return {
      success: true,
      message: isActive 
        ? `Vacation Mode activated. Your store is now paused until ${vacationConfig.resumeTimestamp || 'further notice'}.`
        : `Vacation Mode deactivated. Your store is now active and open.`,
      vendorId,
      vacationMode: vendor.vacationMode
    };
  }

  /**
   * Check if vendor is currently on vacation
   * @param {String} vendorId 
   * @returns {Boolean}
   */
  isOnVacation(vendorId) {
    const vendor = coreEngine.state.activeVendors.get(vendorId);
    if (!vendor || !vendor.vacationMode) {
      return false;
    }

    // Auto-resume check if resume timestamp has passed
    if (vendor.vacationMode.active && vendor.vacationMode.resumeTimestamp) {
      const now = new Date().getTime();
      const resumeTime = new Date(vendor.vacationMode.resumeTimestamp).getTime();
      if (now >= resumeTime) {
        vendor.vacationMode.active = false;
        vendor.status = 'OPEN';
        coreEngine.setVendorState(vendorId, vendor);
        return false;
      }
    }

    return vendor.vacationMode.active;
  }
}

export const vacationModeScheduler = new VacationModeSchedulerModule();
