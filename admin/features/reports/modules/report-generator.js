export class ReportGeneratorModule {
  static render(container, core) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📊 Custom Report Generator</h4>
        <p style="font-size:13px; color:#586069;">Select date ranges, metrics, and custom filters to compile custom analytics reports.</p>

        <div style="display:flex; gap:10px; margin-top:15px; flex-wrap:wrap;">
          <input type="date" style="padding:6px; border:1px solid #ccc; border-radius:4px;" />
          <input type="date" style="padding:6px; border:1px solid #ccc; border-radius:4px;" />
          <button id="btn-generate-report" style="padding:6px 14px; background:#0088cc; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Generate Report</button>
        </div>
      </div>
    `;

    container.querySelector('#btn-generate-report')?.addEventListener('click', () => {
      alert('Custom Report compiled successfully!');
    });
  }
}
