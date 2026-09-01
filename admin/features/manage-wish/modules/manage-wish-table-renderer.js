/**
 * Manage Wish - Table & Pagination UI Renderer
 * Path: admin/features/manage-wish/modules/manage-wish-table-renderer.js
 */

export class ManageWishTableRenderer {
  renderRows(tbody, paginatedData, selectedIds) {
    if (!tbody) return;

    // FIX: Safe extract items array regardless of parameter format
    const items = Array.isArray(paginatedData) 
      ? paginatedData 
      : (paginatedData?.items || []);

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-msg" style="text-align:center; padding:15px;">No wishes found.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(item => {
      // FIX: Safe selection check (Supports both Set and Array)
      const isSelected = selectedIds?.has 
        ? selectedIds.has(item.Wish_ID) 
        : (Array.isArray(selectedIds) && selectedIds.includes(item.Wish_ID));

      return `
        <tr>
          <td>
            <input type="checkbox" class="row-checkbox" data-id="${item.Wish_ID}" ${isSelected ? 'checked' : ''} />
          </td>
          <td><code>${item.Wish_ID || 'N/A'}</code></td>
          <td><strong>${item.Title || 'Untitled'}</strong></td>
          <td><span class="badge category-${item.Category || 'default'}">${item.Category || 'General'}</span></td>
          <td><span class="badge status-${item.Status || 'active'}">${item.Status || 'Active'}</span></td>
          <td>${item.Created_At ? new Date(item.Created_At).toLocaleDateString() : 'N/A'}</td>
          <td>
            <button class="btn-sm btn-inspect" data-id="${item.Wish_ID}">Inspect</button>
            <button class="btn-sm btn-archive" data-id="${item.Wish_ID}">Archive</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderPagination(container, { currentPage = 1, totalPages = 1, totalCount = 0 }, onPrev, onNext) {
    if (!container) return;

    container.innerHTML = `
      <span>Showing Page ${currentPage} of ${totalPages} (${totalCount} Total Items)</span>
      <div class="page-btns">
        <button id="btn-prev-page" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <button id="btn-next-page" ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}>Next</button>
      </div>
    `;

    document.getElementById('btn-prev-page')?.addEventListener('click', onPrev);
    document.getElementById('btn-next-page')?.addEventListener('click', onNext);
  }
}

export const manageWishTableRendererInstance = new ManageWishTableRenderer();
