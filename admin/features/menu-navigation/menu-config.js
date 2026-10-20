/**
 * Master Connected Menu Navigation Config
 * Path: admin/features/menu-navigation/menu-config.js
 */

import { createWishNavItem } from './items/create-wish-nav.js';
import { assetHubNavItem } from './items/asset-hub-nav.js';
import { manageLoadingNavItem } from './items/manage-loading-nav.js';
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
// Newly Integrated Module Nav Items
import { walletNavItem } from './items/wallet-nav.js';
import { categoriesNavItem } from './items/categories-nav.js';
import { geoNavItem } from './items/geo-nav.js';
import { globalLangNavItem } from './items/global-lang-nav.js';
import { brandingNavItem } from './items/branding-nav.js';
import { platformSuiteNavItem } from './items/platform-suite-nav.js';
import { supportNavItem } from './items/support-nav.js';
// Separate Permissions Nav Items
import { userPermissionsNavItem } from './items/user-permissions-nav.js';
import { managePermissionsNavItem } from './items/manage-permissions-nav.js';
// Sandbox Testing Module Nav Item
import { sandboxNavItem } from './items/sandbox-nav.js';
// Additional Integrated Feature Modules
import { signInNavItem } from './items/sign-in-nav.js';
import { loginNavItem } from './items/login-nav.js';
import { adsNavItem } from './items/ads-nav.js';
import { couponsNavItem } from './items/coupons-nav.js';
import { approvalsNavItem } from './items/approvals-nav.js';
import { automationNavItem } from './items/automation-nav.js';

// Newly Integrated Modules
import { threeDNavItem } from './items/3d-nav.js';
import { affiliateNavItem } from './items/affiliate-nav.js';
import { festivalStorytellerNavItem } from './items/festival-storyteller-nav.js';
import { localVendorsNavItem } from './items/local-vendors-nav.js';
import { payRefundNavItem } from './items/pay-refund-nav.js';

// Safe Filter Array function to prevent crash if any nav item import is undefined/missing
const rawNavItems = [
  createWishNavItem,
  assetHubNavItem,
  manageLoadingNavItem,
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
  settingNavItem,
  walletNavItem,
  categoriesNavItem,
  geoNavItem,
  globalLangNavItem,
  brandingNavItem,
  platformSuiteNavItem,
  supportNavItem,
  userPermissionsNavItem,
  managePermissionsNavItem,
  sandboxNavItem,
  signInNavItem,
  loginNavItem,
  adsNavItem,
  couponsNavItem,
  approvalsNavItem,
  automationNavItem,
  threeDNavItem,
  affiliateNavItem,
  festivalStorytellerNavItem,
  localVendorsNavItem,
  payRefundNavItem
];

export const MENU_CONFIG = {
  BRAND: {
    NAME: 'Wishes Hub',
    LOGO_ICON: '✨'
  },
  // Filter out any undefined/unloaded items to prevent script crash
  NAV_ITEMS: rawNavItems.filter(Boolean)
};
