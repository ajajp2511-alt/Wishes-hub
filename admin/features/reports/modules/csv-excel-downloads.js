export class CsvExcelDownloadsModule {
  static render(container, core) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📁 CSV / Excel Raw Data Export</h4>
        <p style="font-size:13px; color:#586069;">Export raw traffic, wish creations, and revenue data with optional PII data masking.</p>

        <div style="margin-top:15px; display:flex; gap:10px;">
          <button id="export-csv-btn" style="padding:8px 16px; background:#28a745; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Export CSV</button>
          <button id="export-xlsx-btn" style="padding:8px 16px; background:#107c41; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Export Excel (XLSX)</button>
        </div>
      </div>
    `;

    container.querySelector('#export-csv-btn')?.addEventListener('click', () => {
      const res = core.exportData('CSV', 'Traffic_Metrics');
      alert(`File Generated: ${res.fileName}`);
    });
  }
}
