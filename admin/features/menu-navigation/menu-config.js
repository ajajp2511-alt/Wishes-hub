/**
 * Master Connected Menu Navigation Config
 * Path: admin/features/menu-navigation/menu-config.js
 */

import { createWishNavItem } from './items/create-wish-nav.js';
import { assetHubNavItem } from './items/asset-hub-nav.js';
import { wishesNavItem } from './items/wishes-nav.js';
import { usersNavItem } from './items/users-nav.js';
import { securityNavItem } from './items/security-nav.js';
import { pwaNavItem } from './items/pwa-nav.js';
import { featureFlagsNavItem } from './items/feature-flags-nav.js';
import { gamificationNavItem } from './items/gamification-nav.js';
import { marketplaceNavItem } from './items/marketplace-nav.js';
import { campaignsNavItem } from './items/campaigns-nav.js';
import { templateEngineNavItem } from './items/template-engine-nav.js';
import { mediaNavItem } from './items/media-nav.js';
import { aiStudioNavItem } from './items/ai-studio-nav.js';
import { localizationNavItem } from './items/localization-nav.js';
import { analyticsNavItem } from './items/analytics-nav.js';
import { seoGrowthNavItem } from './items/seo-growth-nav.js';
import { reportsNavItem } from './items/reports-nav.js';
import { trendingNavItem } from './items/trending-nav.js';
import { experimentsNavItem } from './items/experiments-nav.js';
import { monetizationNavItem } from './items/monetization-nav.js';
import { linkNavItem } from './items/link-nav.js';
import { shareNavItem } from './items/share-nav.js';
import { communityNavItem } from './items/community-nav.js';
import { notificationsNavItem } from './items/notifications-nav.js';
import { priceNavItem } from './items/price-nav.js';
import { performanceNavItem } from './items/performance-nav.js';
import { sysHealthNavItem } from './items/sys-health-nav.js';
import { workerAnalyticsNavItem } from './items/worker-analytics-nav.js';
import { googleSheetsNavItem } from './items/google-sheets-nav.js';
import { integrationsNavItem } from './items/integrations-nav.js';
import { complianceNavItem } from './items/compliance-nav.js';
import { logsNavItem } from './items/logs-nav.js';
import { authNavItem } from './items/auth-nav.js';
import { settingNavItem } from './items/setting-nav.js';

export const MENU_CONFIG = {
  BRAND: {
    NAME: 'Wishes Hub',
    LOGO_ICON: '✨'
  },
  NAV_ITEMS: [
    createWishNavItem,
    assetHubNavItem,
    wishesNavItem,
    usersNavItem,
    securityNavItem,
    pwaNavItem,
    featureFlagsNavItem,
    gamificationNavItem,
    marketplaceNavItem,
    campaignsNavItem,
    templateEngineNavItem,
    mediaNavItem,
    aiStudioNavItem,
    localizationNavItem,
    analyticsNavItem,
    seoGrowthNavItem,
    reportsNavItem,
    trendingNavItem,
    experimentsNavItem,
    monetizationNavItem,
    linkNavItem,
    shareNavItem,
    communityNavItem,
    notificationsNavItem,
    priceNavItem,
    performanceNavItem,
    sysHealthNavItem,
    workerAnalyticsNavItem,
    googleSheetsNavItem,
    integrationsNavItem,
    complianceNavItem,
    logsNavItem,
    authNavItem,
    settingNavItem
  ]
};
