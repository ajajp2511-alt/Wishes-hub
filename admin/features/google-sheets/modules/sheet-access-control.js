export class SheetAccessControlModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔐 Row-Level Access & Column Masking</h4>
        <p style="font-size:13px; color:#586069;">Set admin read/edit privileges and mask sensitive user details in sheets.</p>
      </div>
    `;
  }
}
