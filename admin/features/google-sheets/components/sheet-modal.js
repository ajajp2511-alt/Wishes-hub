// admin/features/google-sheets/components/sheet-modal.js

export function renderAddSheetModal(container, onSubmit, onClose) {
  container.innerHTML = `
    <div class="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
      <div class="modal-content" style="background: white; padding: 25px; border-radius: 8px; width: 350px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0;">Add New Google Sheet</h3>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; font-size: 13px; margin-bottom: 5px;">Sheet Name</label>
          <input type="text" id="modal-sheet-name" placeholder="e.g. Festival Wishes" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; font-size: 13px; margin-bottom: 5px;">Google Sheet ID</label>
          <input type="text" id="modal-sheet-id" placeholder="Paste ID here..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button id="modal-cancel-btn" style="padding: 8px 15px; background: #e5e7eb; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
          <button id="modal-submit-btn" style="padding: 8px 15px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Sheet</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-cancel-btn').addEventListener('click', onClose);
  document.getElementById('modal-submit-btn').addEventListener('click', () => {
    const name = document.getElementById('modal-sheet-name').value.trim();
    const id = document.getElementById('modal-sheet-id').value.trim();
    if (!name || !id) {
      alert('Dono fields bharna zaroori hai!');
      return;
    }
    onSubmit(name, id);
  });
}
