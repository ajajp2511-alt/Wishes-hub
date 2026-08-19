/**
 * Main Assembly Controller - Integrations & Webhooks
 * Path: admin/features/integrations/integrations-assembly.js
 */

import { integrationsCoreInstance } from './integrations-core.js';
import { ActiveWebhooksModule } from './modules/active-webhooks.js';
import { ApiGatewayModule } from './modules/api-gateway.js';
import { ThirdPartyServicesModule } from './modules/third-party-services.js';
import { WebhookPayloadTransformerModule } from './modules/webhook-payload-transformer.js';
import { WebhookDlqRetryModule } from './modules/webhook-dlq-retry.js';
import { OauthProviderManagerModule } from './modules/oauth-provider-manager.js';
import { ApiRateLimiterModule } from './modules/api-rate-limiter.js';
import { WebhookHmacSecurityModule } from './modules/webhook-hmac-security.js';
import { ApiSandboxMockModule } from './modules/api-sandbox-mock.js';
import { IpWhitelistFirewallModule } from './modules/ip-whitelist-firewall.js';

export class IntegrationsAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'active-webhooks';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="integrations-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Integrations & Webhooks Hub</h2>
          <small style="color:#6e7681;">Active Webhooks, API Gateways, OAuth Providers & HMAC Security</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="active-webhooks">Active Webhooks</button>
          <button class="tab-btn" data-subtab="api-gateway">API Gateway</button>
          <button class="tab-btn" data-subtab="third-party">3rd-Party Vault</button>
          <button class="tab-btn" data-subtab="transformer">Payload Transformer</button>
          <button class="tab-btn" data-subtab="dlq-retry">DLQ & Retries</button>
          <button class="tab-btn" data-subtab="oauth">OAuth Providers</button>
          <button class="tab-btn" data-subtab="rate-limit">Rate Limiter</button>
          <button class="tab-btn" data-subtab="hmac">HMAC Security</button>
          <button class="tab-btn" data-subtab="sandbox">Sandbox & Mocks</button>
          <button class="tab-btn" data-subtab="firewall">IP Firewall</button>
        </nav>

        <main id="integrations-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#integrations-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'active-webhooks': ActiveWebhooksModule.render(view, integrationsCoreInstance); break;
      case 'api-gateway': ApiGatewayModule.render(view, integrationsCoreInstance); break;
      case 'third-party': ThirdPartyServicesModule.render(view, integrationsCoreInstance); break;
      case 'transformer': WebhookPayloadTransformerModule.render(view); break;
      case 'dlq-retry': WebhookDlqRetryModule.render(view); break;
      case 'oauth': OauthProviderManagerModule.render(view); break;
      case 'rate-limit': ApiRateLimiterModule.render(view); break;
      case 'hmac': WebhookHmacSecurityModule.render(view); break;
      case 'sandbox': ApiSandboxMockModule.render(view); break;
      case 'firewall': IpWhitelistFirewallModule.render(view); break;
      default: ActiveWebhooksModule.render(view, integrationsCoreInstance); break;
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

export const integrationsAssemblyInstance = new IntegrationsAssembly();
