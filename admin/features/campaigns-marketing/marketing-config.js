/**
 * Campaigns & Marketing Configuration
 * Path: admin/features/campaigns-marketing/marketing-config.js
 */

export const MARKETING_CONFIG = {
  version: '1.0.0',
  rateLimits: {
    whatsappPerMin: 50,
    telegramPerMin: 100,
    emailPerBatch: 500
  },
  defaultCampaigns: [
    { id: 'cmp_101', name: 'Diwali Festival Blast 2026', channel: 'WhatsApp', status: 'Scheduled', scheduledDate: '2026-11-01' },
    { id: 'cmp_102', name: 'Weekly Newsletter #42', channel: 'Email', status: 'Completed', openRate: '34.2%' }
  ]
};
