export class CreatorSubmissionsModule {
  static render(container, core) {
    const list = core.getSubmissions();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4>Creator Submissions & Review Queue</h4>
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">
          ${list.map(s => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border:1px solid #e1e4e8; border-radius:6px;">
              <div>
                <strong>${s.title}</strong>
                <small style="color:#586069; display:block;">Submitted by: ${s.creator}</small>
              </div>
              <div>
                <span style="font-size:12px; margin-right:10px; color:#d97706;">${s.status}</span>
                <button class="btn-approve" data-id="${s.id}" style="padding:6px 12px; background:#2da44e; color:#fff; border:none; border-radius:4px; cursor:pointer;">Approve & Publish</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
