export class IpWhitelistFirewallModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🛡️ IP Whitelisting & Integration Firewall</h4>
        <p style="font-size:13px; color:#586069;">Restrict API access by IP range and manage fixed egress IP proxies for outgoing webhooks.</p>
      </div>
    `;
  }
}
