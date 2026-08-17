/**
 * Community Core Engine
 * Path: admin/features/community-feedback/community-core.js
 */

import { COMMUNITY_CONFIG } from './community-config.js';

export class CommunityCore {
  constructor() {
    this.wishRequests = [
      { id: 'REQ-201', user: 'Aarav Sharma', theme: '3D Golden Ganesha Card', upvotes: 142, status: 'Under Review' },
      { id: 'REQ-202', user: 'Priya Patel', theme: 'Animated Neon Rakhi Wish', upvotes: 98, status: 'Approved' }
    ];

    this.tickets = [
      { id: 'TCK-501', user: 'Rohan Verma', subject: 'WhatsApp link sharing issue', status: 'Open', priority: 'High' },
      { id: 'TCK-502', user: 'Neha Gupta', subject: 'Custom name font support', status: 'Closed', priority: 'Low' }
    ];

    this.comments = [
      { id: 'CMT-801', card: 'Diwali Festive Special', text: 'Amazing card designs!', status: 'Approved', sentiment: 'Positive' },
      { id: 'CMT-802', card: 'New Year Wish 2026', text: 'Please add more local fonts', status: 'Pending', sentiment: 'Neutral' }
    ];
  }

  getWishRequests() { return this.wishRequests; }
  getTickets() { return this.tickets; }
  getComments() { return this.comments; }

  approveWishRequest(reqId) {
    const item = this.wishRequests.find(r => r.id === reqId);
    if (item) item.status = 'Approved';
  }
}

export const communityCoreInstance = new CommunityCore();
