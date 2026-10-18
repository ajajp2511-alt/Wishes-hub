/**
 * 3D Time-Capsule Countdown Lock Module
 * Path: wishes-hub/admin/features/3d/modules/3d-time-capsule.js
 */

import { coreEngine } from '../3d-core.js';

export class TimeCapsule {
  constructor() {
    this.moduleName = '3d-time-capsule';
    this.unlockTimestamp = null;
    this.isLocked = true;
    this.timerInterval = null;

    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Set unlock target date & time for time-capsule wish
  setUnlockTime(targetTimestamp) {
    this.unlockTimestamp = targetTimestamp;
    const currentTime = Date.now();

    if (currentTime >= this.unlockTimestamp) {
      this.isLocked = false;
      coreEngine.emit('timecapsule:unlocked', { timestamp: currentTime });
      return;
    }

    this.isLocked = true;
    this.startCountdown();
    coreEngine.emit('timecapsule:locked', { targetTimestamp: this.unlockTimestamp });
  }

  startCountdown() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      const now = Date.now();
      const remainingTime = this.unlockTimestamp - now;

      if (remainingTime <= 0) {
        clearInterval(this.timerInterval);
        this.isLocked = false;
        coreEngine.emit('timecapsule:unlocked', { timestamp: now });
        console.log('[Time Capsule] Capsule unlocked successfully.');
      } else {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        coreEngine.emit('timecapsule:tick', { remainingTime, days, hours, minutes, seconds });
      }
    }, 1000);
  }
}

export default TimeCapsule;
