export class KycVerificationModule {
  static render(container, core) {
    const list = core.getKycRequests();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4>KYC & Identity Verification Shield</h4>
        ${list.map(k => `
          <div style="padding:10px; border:1px solid #d1d5da; border-radius:6px; margin-top:10px;">
            <strong>${k.creator}</strong> — PAN Status: <code>${k.panStatus}</code>
            <span style="float:right; color:#2da44e;">${k.status}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
}
