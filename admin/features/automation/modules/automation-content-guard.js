/**
 * AI Content Moderation & Abuse Guard
 * Path: admin/features/automation/modules/automation-content-guard.js
 * Description: Scans input fields (Sender/Receiver Names, custom quotes) for profanity,
 *              offensive slang, and policy violations to protect platform brand integrity.
 */

import { AUTOMATION_CONFIG } from '../automation-config.js';
import { automationCore } from '../automation-core.js';

export class AutomationContentGuardEngine {
  constructor() {
    this.config = AUTOMATION_CONFIG;
    this.core = automationCore;
  }

  /**
   * Validate text string against abuse & profanity rules
   */
  validateInput(text, fieldName = 'Name') {
    const rules = this.config.contentGuardRules;

    if (!text || !text.trim()) {
      return { valid: true, cleanText: '' };
    }

    const trimmed = text.trim();

    // Rule 1: Length Guard
    if (trimmed.length > rules.maxNameLength) {
      this.core.log('CONTENT_GUARD', `Validation failed for ${fieldName}: Exceeds length limit (${rules.maxNameLength})`, 'WARN');
      return { valid: false, reason: `${fieldName} cannot exceed ${rules.maxNameLength} characters.` };
    }

    // Rule 2: Profanity & Blocked Keyword Filter
    const lower = trimmed.toLowerCase();
    const detectedKeyword = rules.blockedKeywords.find(word => lower.includes(word));

    if (detectedKeyword) {
      this.core.log('CONTENT_GUARD', `Blocked offensive input in ${fieldName}: Detected phrase [${detectedKeyword}]`, 'WARN');
      return {
        valid: false,
        reason: `${fieldName} contains inappropriate or restricted words.`
      };
    }

    // Rule 3: HTML / Script Injection Guard
    const sanitized = trimmed.replace(/<[^>]*>?/gm, '');

    return {
      valid: true,
      cleanText: sanitized
    };
  }
}

export const automationContentGuard = new AutomationContentGuardEngine();
