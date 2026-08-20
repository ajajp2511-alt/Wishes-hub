export class TermsCopyrightModule {
  static render(container, core) {
    const terms = core.getTermsVersion();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📜 Terms of Service & Copyright Policy Rules</h4>
        <p style="font-size:13px; color:#586069;">Manage active legal policies, licensing rules, and acceptance metrics.</p>

        <div style="margin-top:15px; font-size:13px;">
          <p><strong>Active Policy Version:</strong> <code>${terms.currentVersion}</code></p>
          <p><strong>Effective Date:</strong> ${terms.effectiveDate}</p>
          <p><strong>User Acceptance Rate:</strong> <span style="color:#28a745; font-weight:bold;">${terms.userAcceptanceRate}</span></p>
        </div>
      </div>
    `;
  }
}
