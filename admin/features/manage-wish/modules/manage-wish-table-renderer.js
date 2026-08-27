/**
 * Manage Wish - Table & Pagination UI Renderer
 * Path: admin/features/manage-wish/modules/manage-wish-table-renderer.js
 */

import { manageWishSafetyInstance } from './manage-wish-safety.js';

export class ManageWishTableRenderer {
  renderRows(tbody, paginatedData, selectedIds) {
    if (!tbody) return;

    if (paginatedData.items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-msg">No wishes found.</td></tr>`;
      return;
    }

    tbody.innerHTML = paginatedData.items.map(item => {
      const safetyCheck = manageWishSafetyInstance.inspectForSpam(item.Content, item.Title);
      const isSelected = selectedIds.has(item.Wish_ID);

      return `
        <tr class="${safetyCheck.isSpam ? 'row-spam-warning' : ''}">
          <td>
            <input type="checkbox" class="row-checkbox" data-id="${item.Wish_ID}" ${isSelected ? 'checked' : ''} />
          </td>
          <td><code>${item.Wish_ID}</code></td>
          <td><strong>${item.Title || 'Untitled'}</strong></td>
          <td><span class="badge category-${item.Category}">${item.Category}</span></td>
          <td><span class="badge status-${item.Status}">${item.Status}</span></td>
          <td>${new Date(item.Created_At).toLocaleDateString()}</td>
          <td>
            <button class="btn-sm btn-inspect" data-id="${item.Wish_ID}">Inspect</button>
            <button class="btn-sm btn-archive" data-id="${item.Wish_ID}">Archive</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderPagination(container, { currentPage, totalPages, totalCount }, onPrev, onNext) {
    if (!container) return;

    container.innerHTML = `
      <span>Showing Page ${currentPage} of ${totalPages} (${totalCount} Total Items)</span>
      <div class="page-btns">
        <button id="btn-prev-page" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <button id="btn-next-page" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
      </div>
    `;

    document.getElementById('btn-prev-page')?.addEventListener('click', onPrev);
    document.getElementById('btn-next-page')?.addEventListener('click', onNext);
  }
}

export const manageWishTableRendererInstance = new ManageWishTableRenderer();
