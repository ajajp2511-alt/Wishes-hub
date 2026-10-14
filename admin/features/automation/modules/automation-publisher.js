/**
 * Staging, Auto-Publish & Expiry Engine
 * Path: admin/features/automation/modules/automation-publisher.js
 * Description: Controls staging lifecycle, automated scheduled publishing, 
 *              and post-festival expiry redirection guards.
 */

import { AUTOMATION_CONFIG } from '../automation-config.js';
import { automationCore } from '../automation-core.js';

export class AutomationPublisherEngine {
  constructor() {
    this.config = AUTOMATION_CONFIG;
    this.core = automationCore;
  }

  /**
   * Evaluate Staging Queue Item for Auto-Publishing
   */
  evaluatePublishingState(queueItem) {
    const now = new Date();
    const eventDate = new Date(queueItem.calculatedEventDate || queueItem.eventDate);

    // Rule 1: Auto-Publish Lead Time Check (e.g. 48 Hours before festival)
    const leadHours = this.config.autoPublishSettings.draftLeadTimeHours || 48;
    const publishTriggerTime = new Date(eventDate.getTime() - (leadHours * 60 * 60 * 1000));

    if (now >= publishTriggerTime && queueItem.status === 'STAGED') {
      queueItem.status = 'PUBLISHED';
      queueItem.publishedAt = now.toISOString();
      this.core.log('PUBLISHER', `Auto-published campaign: ${queueItem.festivalName || queueItem.id}`, 'SUCCESS');
      return { action: 'PUBLISHED', queueItem };
    }

    // Rule 2: Expiry Check (e.g. 3 Days after festival)
    const expiryDays = this.config.autoPublishSettings.autoArchiveAfterDays || 3;
    const expiryTriggerTime = new Date(eventDate.getTime() + (expiryDays * 24 * 60 * 60 * 1000));

    if (now > expiryTriggerTime && queueItem.status === 'PUBLISHED') {
      queueItem.status = 'ARCHIVED';
      queueItem.archivedAt = now.toISOString();
      this.core.log('PUBLISHER', `Auto-archived expired campaign: ${queueItem.festivalName || queueItem.id}`, 'WARN');
      return { action: 'ARCHIVED', queueItem };
    }

    return { action: 'NO_CHANGE', currentStatus: queueItem.status };
  }

  /**
   * Force Manual Publish State Overwrite
   */
  forcePublish(itemId) {
    const success = this.core.updateQueueStatus(itemId, 'PUBLISHED');
    if (success) {
      this.core.log('PUBLISHER', `Manually force-published item [${itemId}]`, 'SUCCESS');
    }
    return success;
  }
}

export const automationPublisher = new AutomationPublisherEngine();
