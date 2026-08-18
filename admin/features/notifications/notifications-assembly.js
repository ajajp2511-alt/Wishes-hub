/**
 * Main Assembly Controller - Notifications
 * Path: admin/features/notifications/notifications-assembly.js
 */

import { notificationsCoreInstance } from './notifications-core.js';
import { WebPushAlertsModule } from './modules/web-push-alerts.js';
import { FestiveBroadcasterModule } from './modules/festive-broadcaster.js';
import { MessageTemplatesModule } from './modules/message-templates.js';
import { InAppNotificationCenterModule } from './modules/in-app-notification-center.js';
import { AudienceSegmentationModule } from './modules/audience-segmentation.js';
import { PushAbTestingModule } from './modules/push-ab-testing.js';
import { ReengagementAutomationModule } from './modules/reengagement-automation.js';
import { OmnichannelGatewayModule } from './modules/omnichannel-gateway.js';
import { NotificationAnalyticsHeatmapModule } from './modules/notification-analytics-heatmap.js';
import { FrequencyCapQuietHoursModule } from './modules/frequency-cap-quiet-hours.js';
import { RealtimeActivityTriggersModule } from './modules/realtime-activity-triggers.js';
import { RichInteractivePushBuilderModule } from './modules/rich-interactive-push-builder.js';
import { GeoFenceFestivalAlertsModule } from './modules/geo-fence-festival-alerts.js';
import { TimezoneSmartSchedulerModule } from './modules/timezone-smart-scheduler.js';
import { FallbackSmsWhatsappGatewayModule } from './modules/fallback-sms-whatsapp-gateway.js';
import { OptoutUnsubscribeAnalyticsModule } from './modules/optout-unsubscribe-analytics.js';

export class NotificationsAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'web-push';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="notifications-manager-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Notifications & Broadcaster Studio</h2>
          <small style="color:#6e7681;">Web Push Alerts, Festive Broadcaster & Omnichannel Messaging</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="web-push">Web Push</button>
          <button class="tab-btn" data-subtab="broadcaster">Festive Broadcaster</button>
          <button class="tab-btn" data-subtab="templates">Templates</button>
          <button class="tab-btn" data-subtab="in-app">In-App Tray</button>
          <button class="tab-btn" data-subtab="segmentation">Segmentation</button>
          <button class="tab-btn" data-subtab="ab-testing">A/B Testing</button>
          <button class="tab-btn" data-subtab="reengagement">Re-engagement</button>
          <button class="tab-btn" data-subtab="omnichannel">Omnichannel Gateway</button>
          <button class="tab-btn" data-subtab="analytics">CTR Heatmap</button>
          <button class="tab-btn" data-subtab="frequency-cap">Rate Limiting</button>
          <button class="tab-btn" data-subtab="activity-triggers">Activity Alerts</button>
          <button class="tab-btn" data-subtab="rich-builder">Rich Media Builder</button>
          <button class="tab-btn" data-subtab="geofence">Geo-Location Alerts</button>
          <button class="tab-btn" data-subtab="timezone">Timezone Scheduler</button>
          <button class="tab-btn" data-subtab="fallback-gateway">Fallback Gateway</button>
          <button class="tab-btn" data-subtab="optout-analytics">Opt-Out Guard</button>
        </nav>

        <main id="notifications-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#notifications-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'web-push': WebPushAlertsModule.render(view, notificationsCoreInstance); break;
      case 'broadcaster': FestiveBroadcasterModule.render(view, notificationsCoreInstance); break;
      case 'templates': MessageTemplatesModule.render(view, notificationsCoreInstance); break;
      case 'in-app': InAppNotificationCenterModule.render(view); break;
      case 'segmentation': AudienceSegmentationModule.render(view); break;
      case 'ab-testing': PushAbTestingModule.render(view); break;
      case 'reengagement': ReengagementAutomationModule.render(view); break;
      case 'omnichannel': OmnichannelGatewayModule.render(view); break;
      case 'analytics': NotificationAnalyticsHeatmapModule.render(view); break;
      case 'frequency-cap': FrequencyCapQuietHoursModule.render(view); break;
      case 'activity-triggers': RealtimeActivityTriggersModule.render(view); break;
      case 'rich-builder': RichInteractivePushBuilderModule.render(view); break;
      case 'geofence': GeoFenceFestivalAlertsModule.render(view); break;
      case 'timezone': TimezoneSmartSchedulerModule.render(view); break;
      case 'fallback-gateway': FallbackSmsWhatsappGatewayModule.render(view); break;
      case 'optout-analytics': OptoutUnsubscribeAnalyticsModule.render(view); break;
      default: WebPushAlertsModule.render(view, notificationsCoreInstance); break;
    }
  }

  attachEventListeners() {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.style.fontWeight = 'normal';
        });
        
        e.target.classList.add('active');
        e.target.style.fontWeight = 'bold';
        
        this.activeSubTab = e.target.dataset.subtab;
        this.renderActiveSubTab();
      });
    });
  }
}

export const notificationsAssemblyInstance = new NotificationsAssembly();
