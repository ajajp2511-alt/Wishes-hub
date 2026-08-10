// admin/features/menu-navigation/menu-config.js

export const MENU_CONFIG = {
  BRAND: {
    NAME: 'Wishes Hub',
    LOGO_ICON: '✨'
  },
  NAV_ITEMS: [
    {
      id: 'create-wish',
      label: 'Create Wish',
      icon: '➕',
      subItems: [
        { id: 'create-text', label: 'Text & Quote Wish' },
        { id: 'create-image', label: 'Image & Poster Wish' },
        { id: 'create-audio', label: 'Audio & Musical Wish' },
        { id: 'create-video', label: 'Video & Animated Wish' },
        { id: 'create-story', label: 'Multi-Page Story Wish' },
        { id: 'create-interactive', label: 'Interactive / Game Wish' },
        { id: 'create-ai', label: 'AI Quick Wish' }
      ]
    },
    {
      id: 'asset-hub',
      label: 'Asset & Inventory Hub',
      icon: '📦',
      subItems: [
        { id: 'asset-animations', label: 'Animation List' },
        { id: 'asset-songs', label: 'Song ID List' },
        { id: 'asset-invitations', label: 'Invitation Card List' },
        { id: 'asset-particles', label: 'Particle & Effect List' },
        { id: 'asset-fonts', label: 'Typography & Font List' },
        { id: 'asset-frames', label: 'Frame & Border List' },
        { id: 'asset-stickers', label: 'Sticker & Emoji List' },
        { id: 'asset-palettes', label: 'Color Palette Presets' }
      ]
    },
    {
      id: 'wishes',
      label: 'Wishes Manager',
      icon: '✨',
      subItems: [
        { id: 'wishes-all', label: 'All Wishes List' },
        { id: 'wishes-categories', label: 'Categories & Tags' },
        { id: 'wishes-templates', label: 'Template Layouts' }
      ]
    },
    {
      id: 'users',
      label: 'Users & CRM',
      icon: '👥',
      subItems: [
        { id: 'users-all', label: 'All Registered Users' },
        { id: 'users-activity', label: 'User Activity' },
        { id: 'users-saved', label: 'Saved Wishes' },
        { id: 'users-data-collected', label: 'User Data & Privacy Vault' }
      ]
    },
    {
      id: 'security-shield',
      label: 'Security & Threat Shield',
      icon: '🛡️',
      subItems: [
        { id: 'sec-threat-logs', label: 'Live Threat & Attack Logs' },
        { id: 'sec-ip-blacklist', label: 'IP Blacklist & Firewall Rules' },
        { id: 'sec-bot-protection', label: 'Bot Defense & Rate Limiting' },
        { id: 'sec-2fa-sessions', label: 'Active Sessions & 2FA Control' }
      ]
    },
    {
      id: 'pwa-app',
      label: 'App & PWA Manager',
      icon: '📱',
      subItems: [
        { id: 'pwa-manifest', label: 'PWA Manifest & Workers' },
        { id: 'pwa-tokens', label: 'App Push Token Registry' },
        { id: 'pwa-deeplinks', label: 'Deep Link Rules' }
      ]
    },
    {
      id: 'feature-flags',
      label: 'Feature Flags & Staging',
      icon: '🚩',
      subItems: [
        { id: 'flags-toggles', label: 'Feature Toggles' },
        { id: 'flags-staging', label: 'Staging Sandbox' },
        { id: 'flags-rollback', label: 'Data Rollback & Reset' }
      ]
    },
    {
      id: 'gamification',
      label: 'Gamification & Rewards',
      icon: '🏆',
      subItems: [
        { id: 'gami-streaks', label: 'Daily Streak & Rewards' },
        { id: 'gami-spin', label: 'Referral & Spin Wheel' },
        { id: 'gami-leaderboard', label: 'User Leaderboard' }
      ]
    },
    {
      id: 'marketplace',
      label: 'Marketplace & Creators',
      icon: '🏪',
      subItems: [
        { id: 'market-store', label: 'Premium Templates Store' },
        { id: 'market-creators', label: 'Creator Submissions' },
        { id: 'market-payouts', label: 'Payouts & Commissions' }
      ]
    },
    {
      id: 'campaigns',
      label: 'Campaigns & Marketing',
      icon: '📢',
      subItems: [
        { id: 'camp-scheduler', label: 'Festival Blast Scheduler' },
        { id: 'camp-bots', label: 'WhatsApp & Telegram Bots' },
        { id: 'camp-newsletters', label: 'Email Newsletters' }
      ]
    },
    {
      id: 'template-engine',
      label: 'Content Engine & Templates',
      icon: '🎨',
      subItems: [
        { id: 'engine-canvas', label: 'Canvas Layout Builder' },
        { id: 'engine-fonts', label: 'Font & Canvas Assets' },
        { id: 'engine-packs', label: 'Festive Asset Packs' }
      ]
    },
    {
      id: 'media',
      label: 'Media Manager',
      icon: '🖼️',
      subItems: [
        { id: 'media-images', label: 'Images & SVGs' },
        { id: 'media-audio', label: 'Audio Tracks' },
        { id: 'media-stickers', label: 'Stickers & Overlays' },
        { id: 'media-storage', label: 'Cloud Storage Sync' }
      ]
    },
    {
      id: 'ai-studio',
      label: 'AI & Automation Studio',
      icon: '🤖',
      subItems: [
        { id: 'ai-generator', label: 'Wish Generator' },
        { id: 'ai-prompts', label: 'Prompt Presets' },
        { id: 'ai-translator', label: 'Multi-Language Translator' }
      ]
    },
    {
      id: 'localization',
      label: 'Localization & Languages',
      icon: '🌐',
      subItems: [
        { id: 'loc-languages', label: 'Active Languages' },
        { id: 'loc-translations', label: 'Translation Keys' },
        { id: 'loc-regional-dates', label: 'Regional Festival Calendar' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📊',
      subItems: [
        { id: 'analytics-traffic', label: 'Live Traffic' },
        { id: 'analytics-generations', label: 'Wish Generations' },
        { id: 'analytics-geo', label: 'Geographic Insights' }
      ]
    },
    {
      id: 'seo-growth',
      label: 'SEO & Traffic Growth',
      icon: '📈',
      subItems: [
        { id: 'seo-sitemap', label: 'Automated Sitemap & Indexing' },
        { id: 'seo-schema', label: 'Schema & Microdata' },
        { id: 'seo-domains', label: 'Domain & Routing Rules' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: '📥',
      subItems: [
        { id: 'reports-builder', label: 'Report Generator' },
        { id: 'reports-scheduled', label: 'Automated Email Reports' },
        { id: 'reports-exports', label: 'CSV / Excel Downloads' }
      ]
    },
    {
      id: 'trending',
      label: 'Trending Engine',
      icon: '🔥',
      subItems: [
        { id: 'trending-featured', label: 'Homepage Hero' },
        { id: 'trending-festive', label: 'Festive Countdown' },
        { id: 'trending-scoreboard', label: 'Viral Scoreboard' }
      ]
    },
    {
      id: 'experiments',
      label: 'A/B Testing Studio',
      icon: '🧪',
      subItems: [
        { id: 'ab-campaigns', label: 'Active A/B Tests' },
        { id: 'ab-layouts', label: 'Layout Variants' },
        { id: 'ab-conversions', label: 'Conversion Metrics' }
      ]
    },
    {
      id: 'monetization',
      label: 'Monetization & Ads',
      icon: '💰',
      subItems: [
        { id: 'monetization-adsense', label: 'AdSense Placements' },
        { id: 'monetization-banners', label: 'Custom Banner Ads' },
        { id: 'monetization-revenue', label: 'Revenue Dashboard' }
      ]
    },
    {
      id: 'link',
      label: 'Link Manager',
      icon: '🔗',
      subItems: [
        { id: 'link-shortener', label: 'Short Links' },
        { id: 'link-utm', label: 'UTM Builder' },
        { id: 'link-redirects', label: 'Redirect Rules' }
      ]
    },
    {
      id: 'share',
      label: 'Share Manager',
      icon: '📲',
      subItems: [
        { id: 'share-whatsapp', label: 'WhatsApp Scripts' },
        { id: 'share-social', label: 'Social Previews' },
        { id: 'share-widgets', label: 'Embed Widgets' }
      ]
    },
    {
      id: 'community',
      label: 'Community & Feedback',
      icon: '💬',
      subItems: [
        { id: 'comm-requests', label: 'User Wish Requests' },
        { id: 'comm-feedback', label: 'Feedback & Support' },
        { id: 'comm-comments', label: 'Comment Moderation' }
      ]
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      subItems: [
        { id: 'notifications-push', label: 'Web Push Alerts' },
        { id: 'notifications-broadcast', label: 'Festive Broadcaster' },
        { id: 'notifications-templates', label: 'Message Templates' }
      ]
    },
    {
      id: 'price',
      label: 'Price & Plans',
      icon: '🏷️',
      subItems: [
        { id: 'price-tiers', label: 'Pricing Packages' },
        { id: 'price-discounts', label: 'Promo Codes' },
        { id: 'price-gateways', label: 'Payment Gateways' }
      ]
    },
    {
      id: 'performance',
      label: 'Performance & Cache',
      icon: '⚡',
      subItems: [
        { id: 'perf-cache-purge', label: 'Purge CDN Cache' },
        { id: 'perf-image-opt', label: 'Image Compression' },
        { id: 'perf-speed', label: 'PageSpeed Insights' }
      ]
    },
    {
      id: 'sys-health',
      label: 'Health & System Monitor',
      icon: '🚨',
      subItems: [
        { id: 'sys-server', label: 'Server & CDN Status' },
        { id: 'sys-db', label: 'Database Health & Load' },
        { id: 'sys-alerts', label: 'System Alerts & Webhooks' }
      ]
    },
    {
      id: 'worker-analytics',
      label: 'Worker Analytics',
      icon: '👷',
      subItems: [
        { id: 'worker-status', label: 'Edge Worker Status' },
        { id: 'worker-cache', label: 'Cache Performance' },
        { id: 'worker-logs', label: 'Error Logs' }
      ]
    },
    {
      id: 'google-sheets',
      label: 'Google Sheets Views',
      icon: '📄',
      subItems: [
        { id: 'google-sheets-dashboard', label: 'Master Sheet Dashboard' },
        { id: 'sheets-sync', label: 'Sync Status' },
        { id: 'sheets-responses', label: 'Form Responses' },
        { id: 'sheets-mapping', label: 'API Mapping' }
      ]
    },
    {
      id: 'integrations',
      label: 'Integrations & Webhooks',
      icon: '🔌',
      subItems: [
        { id: 'webhooks-active', label: 'Active Webhooks' },
        { id: 'api-endpoints', label: 'API Gateway' },
        { id: 'third-party', label: 'Third-Party Services' }
      ]
    },
    {
      id: 'compliance',
      label: 'Compliance & Legal',
      icon: '🛡️',
      subItems: [
        { id: 'legal-gdpr', label: 'GDPR & Consent' },
        { id: 'legal-terms', label: 'Terms & Copyright Rules' },
        { id: 'legal-abuse', label: 'Abuse & Spam Protection' }
      ]
    },
    {
      id: 'logs',
      label: 'System Logs',
      icon: '📜',
      subItems: [
        { id: 'logs-audit', label: 'Admin Audit Log' },
        { id: 'logs-backups', label: 'Database Backups' },
        { id: 'logs-errors', label: 'API & Crash Logs' }
      ]
    },
    {
      id: 'auth',
      label: 'Auth & Security',
      icon: '🔒',
      subItems: [
        { id: 'auth-users', label: 'Admin Roles & RBAC' },
        { id: 'auth-keys', label: 'API Keys & Secrets' },
        { id: 'auth-security', label: 'IP Whitelist' }
      ]
    },
    {
      id: 'setting',
      label: 'Settings',
      icon: '⚙️',
      subItems: [
        { id: 'setting-seo', label: 'SEO & Meta' },
        { id: 'setting-ads', label: 'AdSense & Ads Config' },
        { id: 'setting-theme', label: 'Theme & Custom CSS' }
      ]
    }
  ]
};
