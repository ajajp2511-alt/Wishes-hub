/**
 * Viral Share-to-Unlock Engine
 * Path: admin/features/automation/modules/automation-viral-unlock.js
 * Description: Enables viral growth by allowing users to unlock premium 3D wish templates
 *              by sharing wish links to a configured number of WhatsApp groups.
 */

import { AUTOMATION_CONFIG } from '../automation-config.js';
import { automationCore } from '../automation-core.js';

export class AutomationViralUnlockEngine {
  constructor() {
    this.config = AUTOMATION_CONFIG;
    this.core = automationCore;
    this.shareCounter = new Map();
  }

  /**
   * Initialize or retrieve share progress for a session
   */
  getShareProgress(sessionId) {
    if (!this.shareCounter.has(sessionId)) {
      this.shareCounter.set(sessionId, {
        sharesCompleted: 0,
        requiredShares: this.config.monetization3D.shareToUnlockFreeThreshold || 3,
        isUnlocked: false
      });
    }
    return this.shareCounter.get(sessionId);
  }

  /**
   * Register a valid WhatsApp share event
   */
  registerShareClick(sessionId) {
    const progress = this.getShareProgress(sessionId);
    
    if (!progress.isUnlocked) {
      progress.sharesCompleted++;
      if (progress.sharesCompleted >= progress.requiredShares) {
        progress.isUnlocked = true;
        this.core.state.metrics.totalViralShares += progress.sharesCompleted;
        this.core.log('VIRAL_UNLOCK', `Session ${sessionId} unlocked premium 3D theme!`, 'SUCCESS');
      } else {
        this.core.log('VIRAL_UNLOCK', `Session ${sessionId} share count: ${progress.sharesCompleted}/${progress.requiredShares}`, 'INFO');
      }
    }

    this.core.saveState();
    return progress;
  }

  /**
   * Build UI status model for share progress modal
   */
  buildShareProgressUI(sessionId) {
    const progress = this.getShareProgress(sessionId);
    const remaining = Math.max(0, progress.requiredShares - progress.sharesCompleted);

    return {
      isUnlocked: progress.isUnlocked,
      sharesCompleted: progress.sharesCompleted,
      requiredShares: progress.requiredShares,
      remainingShares: remaining,
      modalHeadline: progress.isUnlocked 
        ? '🎉 Premium 3D Theme Unlocked!' 
        : `Share to ${remaining} WhatsApp Group${remaining > 1 ? 's' : ''} to Unlock 3D Theme Free!`,
      progressPercentage: Math.min(100, Math.round((progress.sharesCompleted / progress.requiredShares) * 100))
    };
  }
}

export const automationViralUnlock = new AutomationViralUnlockEngine();
