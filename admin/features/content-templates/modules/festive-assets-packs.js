export class FestiveAssetPacksModule {
  static render(container, core) {
    const packs = core.getAssetPacks();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Festive Asset Packs & 3D Elements</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:12px; margin-top:15px;">
          ${packs.map(p => `
            <div style="padding:12px; border:1px solid #e1e4e8; border-radius:6px; background:#fafbfc;">
              <strong>${p.name}</strong>
              <small style="display:block; color:#586069; margin-top:4px;">${p.itemsCount} PNG Items • Category: ${p.category}</small>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
