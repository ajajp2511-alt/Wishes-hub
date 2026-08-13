/**
 * Marketplace & Creators Core Engine
 * Path: admin/features/marketplace-creators/marketplace-core.js
 */

import { MARKETPLACE_CONFIG } from './marketplace-config.js';

export class MarketplaceCore {
  constructor() {
    this.templates = [...MARKETPLACE_CONFIG.defaultTemplates];
    this.submissions = [
      { id: 'sub_1', title: 'Cyberpunk New Year', creator: 'Rohan M', status: 'Pending Review' }
    ];
    this.payouts = [
      { creator: 'Aarav Designs', amount: 4500, status: 'Pending', bankUpi: 'aarav@upi' }
    ];
    this.kycRequests = [
      { creator: 'Priya Studio', panStatus: 'Verified', status: 'Approved' }
    ];
  }

  getTemplates() { return this.templates; }
  getSubmissions() { return this.submissions; }
  getPayouts() { return this.payouts; }
  getKycRequests() { return this.kycRequests; }

  approveSubmission(subId) {
    const sub = this.submissions.find(s => s.id === subId);
    if (sub) {
      sub.status = 'Approved';
      return true;
    }
    return false;
  }

  processPayout(creatorName) {
    const item = this.payouts.find(p => p.creator === creatorName);
    if (item) {
      item.status = 'Completed';
      return true;
    }
    return false;
  }
}

export const marketplaceCoreInstance = new MarketplaceCore();
