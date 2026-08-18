/**
 * Notifications Core Engine
 * Path: admin/features/notifications/notifications-core.js
 */

import { NOTIFICATIONS_CONFIG } from './notifications-config.js';

export class NotificationsCore {
  constructor() {
    this.subscribers = [
      { id: 'SUB-101', device: 'Chrome / Android', region: 'Maharashtra', language: 'hi', status: 'Active' },
      { id: 'SUB-102', device: 'Safari / iOS', region: 'Delhi', language: 'en', status: 'Active' }
    ];

    this.campaigns = [
      { id: 'CMP-301', name: 'Diwali Festive Broadcast', schedule: '2026-11-01 08:00', status: 'Scheduled', sentCount: 45000 },
      { id: 'CMP-302', name: 'New Year Early Bird Wish', schedule: '2026-12-31 18:00', status: 'Draft', sentCount: 0 }
    ];

    this.templates = [
      { id: 'TPL-PUSH-01', title: '🪔 Happy Diwali!', body: '{sender} sent you a special 3D Diwali card!', image: '/images/diwali-hero.jpg' },
      { id: 'TPL-PUSH-02', title: '🎆 New Year Greetings!', body: 'Create your custom 2027 wish in 1-click.', image: '/images/ny-hero.jpg' }
    ];
  }

  getSubscribers() { return this.subscribers; }
  getCampaigns() { return this.campaigns; }
  getTemplates() { return this.templates; }
}

export const notificationsCoreInstance = new NotificationsCore();
