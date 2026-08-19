export class ApiMappingModule {
  static render(container, core) {
    const mappings = core.getSchemaMappings();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔗 API & Schema Field Mapper</h4>
        <p style="font-size:13px; color:#586069;">Align Google Sheet column letters to application database fields.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Column</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Sheet Header Name</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Target DB Payload Key</th>
            </tr>
          </thead>
          <tbody>
            ${mappings.map(m => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>Column ${m.column}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${m.sheetHeader}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${m.dbField}</code></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
