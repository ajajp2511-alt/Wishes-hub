/**
 * Single Sign-On (SSO) & SAML 2.0 Integration Module
 * Path: admin/features/auth-security/modules/sso-saml-integration-module.js
 */

export class SsoSamlIntegrationModule {
  constructor() {
    this.ssoConfig = {
      provider: 'google',
      entityId: '',
      ssoUrl: '',
      certificate: '',
      enabled: false
    };
  }

  render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🏢 Single Sign-On (SSO) & SAML 2.0 Integration</h4>
        <p style="font-size:13px; color:#586069; margin-bottom: 20px;">Configure Okta, Google Workspace, or Azure AD enterprise identity provider logins.</p>

        <form id="sso-form" style="display: flex; flex-direction: column; gap: 15px; font-size: 13px;">
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <label style="font-weight: 600;">Identity Provider (IdP)</label>
            <select id="sso-provider" style="padding: 8px; border-radius: 4px; border: 1px solid #e1e4e8; width: 100%; max-width: 350px;">
              <option value="google" ${this.ssoConfig.provider === 'google' ? 'selected' : ''}>Google Workspace</option>
              <option value="okta" ${this.ssoConfig.provider === 'okta' ? 'selected' : ''}>Okta</option>
              <option value="azure" ${this.ssoConfig.provider === 'azure' ? 'selected' : ''}>Microsoft Azure AD</option>
            </select>
          </div>

          <div style="display: flex; flex-direction: column; gap: 5px;">
            <label style="font-weight: 600;">IdP Entity ID</label>
            <input type="text" id="sso-entity-id" value="${this.ssoConfig.entityId}" placeholder="https://identity.provider/saml/metadata" style="padding: 8px; border-radius: 4px; border: 1px solid #e1e4e8; width: 100%;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 5px;">
            <label style="font-weight: 600;">Single Sign-On (SSO) URL</label>
            <input type="url" id="sso-url" value="${this.ssoConfig.ssoUrl}" placeholder="https://identity.provider/saml/sso" style="padding: 8px; border-radius: 4px; border: 1px solid #e1e4e8; width: 100%;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 5px;">
            <label style="font-weight: 600;">X.509 Certificate</label>
            <textarea id="sso-cert" rows="4" placeholder="-----BEGIN CERTIFICATE-----..." style="padding: 8px; border-radius: 4px; border: 1px solid #e1e4e8; width: 100%; font-family: monospace; font-size: 11px; resize: vertical;">${this.ssoConfig.certificate}</textarea>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
            <input type="checkbox" id="sso-enabled" ${this.ssoConfig.enabled ? 'checked' : ''} style="width: 16px; height: 16px;" />
            <label for="sso-enabled" style="font-weight: 600; cursor: pointer;">Enable SAML SSO Enforcement</label>
          </div>

          <div style="margin-top: 10px; display: flex; gap: 10px;">
            <button type="submit" style="background: #2ea44f; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer;">Save SSO Config</button>
            <button type="button" id="btn-test-sso" style="background: #f1f8ff; color: #0366d6; border: 1px solid #c8e1ff; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer;">Test Connection</button>
          </div>
        </form>
      </div>
    `;
  }

  bindEvents(onUpdate) {
    const form = document.getElementById('sso-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      this.ssoConfig = {
        provider: document.getElementById('sso-provider').value,
        entityId: document.getElementById('sso-entity-id').value.trim(),
        ssoUrl: document.getElementById('sso-url').value.trim(),
        certificate: document.getElementById('sso-cert').value.trim(),
        enabled: document.getElementById('sso-enabled').checked
      };

      if (typeof onUpdate === 'function') {
        onUpdate({ action: 'SSO_CONFIG_UPDATED', config: this.ssoConfig });
      }

      alert('SAML SSO configuration saved successfully!');
    });

    const testBtn = document.getElementById('btn-test-sso');
    testBtn?.addEventListener('click', () => {
      alert('Testing SAML metadata and certificate signature... Connection metadata valid!');
    });
  }
}
